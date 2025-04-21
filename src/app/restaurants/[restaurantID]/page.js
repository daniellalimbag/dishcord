"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { logMessage } from "../../lib/logger"
import ReauthenticationComponent from "../../components/Reauthentication.js";

export default function page({params}) {
    const initialFormData = {
        restaurant: '',
        user: '',
        rating: '',
        comment: ''
    };

    const editForm = {
        user: '',
        rating: '',
        comment: '',
        restaurant: ''
    };
    const [password, setPassword] = useState("");
    const[restaurant, setRestaurant] = useState([]);
    const[reviews, setReviews] = useState([]);
    const[isEditing, setIsEditing] = useState(false);
    const[editingForm, setEditingForm] = useState(editForm);
    const[formData, setFormData] = useState(initialFormData);
    const[userExists, setUserExists] = useState(false);
    const [isManagerEditing, setIsManagerEditing] = useState(false);
    const [requirePassword, setRequirePassword] = useState(false);
    const [restaurantEditForm, setRestaurantEditForm] = useState({
        originalName: '',
        name: '',
        address: '',
        tags: [],
        price_range: '',
        resto_image: '',
        description: '',
        owner: ''
    });

    const session = useSession();
    const status = session?.status
    const userData = session.data?.user;
    const userName = userData?.username;
    const restaurantname = params.restaurantID.replace(/%20/g," ");
    const [errorMessages, setErrorMessages] = useState([]);
    const userRole = userData?.role;
    const [canEditRestaurant, setCanEditRestaurant] = useState(false);

    useEffect(() => {}, [session]);
    
    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const editChangeHandler = (e) => {
        setEditingForm({
            ...editingForm,
            [e.target.name]: e.target.value
        });
    };

    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    };

    const restaurantEditChangeHandler = (e) => {
        if (e.target.name === 'tags') {
            // Split by commas for tags
            setRestaurantEditForm({
                ...restaurantEditForm,
                [e.target.name]: e.target.value.split(',').map(tag => tag.trim())
            });
        } else if (e.target.name !== 'owner') { // Prevent owner field from being changed
            setRestaurantEditForm({
                ...restaurantEditForm,
                [e.target.name]: e.target.value
            });
        }
    };

    
    const prepareRestaurantEdit = () => {
        setRestaurantEditForm({
            originalName: restaurant.name,
            name: restaurant.name,
            address: restaurant.address || '',
            tags: restaurant.tags || [],
            price_range: restaurant.price_range || '',
            resto_image: restaurant.resto_image || '',
            description: restaurant.description || '',
            owner: restaurant.owner || ''
        });
        setIsManagerEditing(true);
    };

    async function submitRestaurantEdit(e) {
        e.preventDefault();
        
        // Keep the original owner
        const dataToSubmit = {
            ...restaurantEditForm,
            owner: restaurant.owner // Ensure owner isn't changed
        };
        
        const response = await fetch('/api/restaurants', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataToSubmit)
        });
        
        if(response.ok) {
            setIsManagerEditing(false);
            // Refresh the page to show updated restaurant info
            window.location = `/restaurants/${encodeURIComponent(restaurantEditForm.name)}`;
        }
    }
    
    async function reauthenticateHandler(e) {
        e.preventDefault();
        setErrorMessages([]); // Clear previous errors
    
        try {
            // Perform reauthentication
            const authenticationResponse = await fetch("/api/authentication", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userName,
                    password, // Password from the reauthentication form
                }),
            });
    
            const result = await authenticationResponse.json();
    
            if (authenticationResponse.ok) {
                const reviewResponse = await fetch("/api/reviews", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        restaurant: restaurantname,
                        user: userName,
                        rating: formData.rating,
                        comment: formData.comment,
                    }),
                });
    
                if (reviewResponse.ok) {
                    window.location = `/restaurants/${params.restaurantID}`;
                    await logMessage(`User ${userName} successfully reauthenticated and submitted a review`, "info", "");
                } else {
                    const errorText = "Failed to submit review. Please try again.";
                    setErrorMessages([errorText]);
                    await logMessage(`User ${userName} reauthentication succeeded, but failed to submit a review`, "error", errorText);
                }
            } else {
                const errorText = result.error || "Invalid credentials. Please try again.";
                setErrorMessages([errorText]);
                await logMessage(`User ${userName} reauthentication failed while trying to submit a review`, "error", errorText);
            }
        } catch (error) {
            console.error("Reauthentication Error:", error.message);
    
            const errorText = "An unexpected error occurred. Please try again.";
            setErrorMessages([errorText]);
            await logMessage(`Unexpected error during reauthentication for ${userName}`, "error", error.message);
        }
    }
    
    async function submitHandler(e) {
        e.preventDefault();
        setErrorMessages([]);
            if (!formData.rating || !formData.comment) {
            setErrorMessages(["Rating and comment fields are required"]);
            return;
        }
            setRequirePassword(true);
    }    

    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await fetch('/api/reviews');
            const data = await response.json();

            const filteredReviews = data.filter(
                (item) => item.restaurant === restaurantname
            );
            setReviews(filteredReviews);
          } catch (error) {
            console.error('Error fetching reviews:', error);
          }
        };
        fetchReviews();
    }, [restaurantname]);


    useEffect(() => {
        setUserExists(false);
        const fetchRestaurantData = async () => {
            try {
              const response = await fetch('/api/restaurants');
              const data = await response.json();
              const foundRestaurant = data.find(
                (item) => item.name === restaurantname
              );
      
              setRestaurant(foundRestaurant);
              if (userData) {
                if (userData.role === 'admin' || 
                    (userData.role === 'manager' && foundRestaurant.owner === userName)) {
                    setCanEditRestaurant(true);
                }
              }
              
            } catch (error) {
               await logMessage(`Error fetching restaurant data`, "error", "");
            }
          };
        fetchRestaurantData();
    }, [userData, userName]);

    async function deleteHandler(e){
        e.preventDefault();

        const response = await fetch('/api/reviews', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userName, restaurantname})
        })

        if(response.ok){
            window.location = `/restaurants/${params.restaurantID}`
        }
    }

    async function editHandler(e){
        console.log("testing edit")
        e.preventDefault();
        editingForm.user = userName;
        editingForm.restaurant = restaurantname;

        const response = await fetch('/api/reviews', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(editingForm)
        })

        console.log({response})

        if(response.ok){
            setIsEditing(false);
            console.log("edit works")
            window.location = `/restaurants/${params.restaurantID}`
        }
    }

    async function doesUserExist(){
        const response = await fetch('/api/reviews');
        const data = await response.json();
        const reviewUserSearch = data.find(
            (item) => item.user === userName && item.restaurant === restaurantname
        );

        if(reviewUserSearch){
            setUserExists(true)
        }
    }


    return (
        <div className="pt-[70px] flex flex-col justify-center bg-background">
            <div className="flex flex-row align-top p-[5%] w-full bg-background">
                <div className="w-[40%]">
                    <img src={restaurant.resto_image} className="rounded-[40px] "/>
                </div>
                <div className="w-[60%] pl-[5%] pt-[4%]">
                    <h1 className="font-bold text-4xl tracking-wide text-foreground">{restaurant.name}</h1>
                    <hr className="w-full border-solid border-[1px] border-accent mb-[5%]"/>
                    <h2 className="text-red-600 text-xl">{restaurant.rating}</h2>
                    <div className="restaurant-minor-deets">
                        <div className="restaurant-tags">
                            {restaurant.tags?.length > 0 && restaurant.tags.map(tags => (
                                <div className="inline-block pb-[2px] pt-[2px] pl-[10px] pr-[10px] rounded-[10px] h-[10%] bg-primary mr-[10px] text-white font-bold text-base">{tags}</div>
                            ))}
                        </div>
                        <br />
                        <h2 className="text-xl text-foreground font-bold">Description:</h2>
                    </div>
                    <h3 className="text-base text-foreground">{restaurant.description}</h3>
                    
                    {/* Add owner information */}
                    <div className="mt-4">
                        <h2 className="text-lg text-foreground font-bold">Owner: {restaurant.owner}</h2>
                    </div>
                </div>
            </div>
            
            {/* Only show edit button for authorized users */}
            {status === 'authenticated' && canEditRestaurant && (
                <div className="flex justify-center mt-4 mb-8">
                    {!isManagerEditing ? (
                        <button 
                            onClick={prepareRestaurantEdit}
                            className="bg-red-700 text-foreground px-6 py-3 rounded-[20px] font-bold hover:bg-black"
                        >
                            Edit Restaurant Information
                        </button>
                    ) : (
                        <div className="w-[80%] bg-slate p-8 rounded-[20px] shadow-md">
                            <h2 className="text-xl font-bold text-red-600 mb-6">Edit Restaurant Information</h2>
                            <form onSubmit={submitRestaurantEdit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-foreground-700 font-bold mb-2">Restaurant Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={restaurantEditForm.name} 
                                            onChange={restaurantEditChangeHandler}
                                            className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-foreground-700 font-bold mb-2">Address</label>
                                        <input 
                                            type="text" 
                                            name="address" 
                                            value={restaurantEditForm.address} 
                                            onChange={restaurantEditChangeHandler}
                                            className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%]"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-foreground-700 font-bold mb-2">Tags (comma-separated)</label>
                                        <input 
                                            type="text" 
                                            name="tags" 
                                            value={restaurantEditForm.tags.join(', ')} 
                                            onChange={restaurantEditChangeHandler}
                                            className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-foreground-700 font-bold mb-2">Price Range</label>
                                        <input 
                                            type="text" 
                                            name="price_range" 
                                            value={restaurantEditForm.price_range} 
                                            onChange={restaurantEditChangeHandler}
                                            className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%]"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-foreground-700 font-bold mb-2">Image URL</label>
                                    <input 
                                        type="text" 
                                        name="resto_image" 
                                        value={restaurantEditForm.resto_image} 
                                        onChange={restaurantEditChangeHandler}
                                        className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%]"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-foreground-700 font-bold mb-2">Description</label>
                                    <textarea 
                                        name="description" 
                                        value={restaurantEditForm.description} 
                                        onChange={restaurantEditChangeHandler}
                                        className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%] h-32"
                                        required
                                    ></textarea>
                                </div>
                                
                                <div>
                                    <label className="block text-foreground-700 font-bold mb-2">Owner</label>
                                    <input 
                                        type="text" 
                                        name="owner" 
                                        value={restaurantEditForm.owner} 
                                        onChange={restaurantEditChangeHandler}
                                        className="w-full px-3 py-2 border-[2px] border-solid  bg-background rounded-[20px] p-[3%]"
                                    />
                                </div>
                                
                                <div className="flex space-x-4">
                                    <button 
                                        type="submit" 
                                        className="h-[50px] w-[50%] rounded-[50px] border-[2px] border-solid border-accent bg-accent text-foreground hover:text-accent hover:bg-background font-bold"
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsManagerEditing(false)}
                                        className="h-[50px] w-[50%] rounded-[50px] border-2 border-solid border-red-600 bg-red-600 text-white hover:bg-red-700 font-bold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
            <div className="mt-4 mb-4 flex flex-row justify-center items-center">
                <div className="flex flex-col w-[1000px] justify-center pb-2 bg-slate shadow-md">
                {status === 'authenticated' && userData.role === 'customer' && !userExists && !requirePassword && (
                <>
                    <div className="w-full flex justify-center">
                        <form className="w-[70%]" onSubmit={submitHandler}>
                            <div className="mt-[50px]">
                                <input
                                    className="placeholder-accent inline-block border-[2px] border-solid  bg-background h-[70px] rounded-[20px] p-[3%] m-[1%_5px_1%_0] w-[20%] font-bold"
                                    type="number"
                                    value={formData.rating}
                                    onChange={changeHandler}
                                    placeholder="Rating"
                                    min="0"
                                    max="5"
                                    name="rating"
                                    required
                                />
                                <input
                                    className="placeholder-accent inline-block border-[2px] border-solid  bg-background h-[70px] rounded-[20px] p-[3%] m-[1%_2px_1%_0] w-[79%] font-bold"
                                    type="text"
                                    value={formData.comment}
                                    onChange={changeHandler}
                                    placeholder="Type your Review"
                                    name="comment"
                                    required
                                />
                            </div>
                            <br />
                            <button
                                className="h-[50px] w-full rounded-[50px] border-[2px] border-solid border-accent bg-accent text-foreground hover:text-accent hover:bg-background font-xl cursor-pointer"
                                type="submit"
                            >
                                <b>+ Write a Review</b>
                            </button>
                        </form>
                    </div>
                    <div className="w-full flex justify-center">
                        <hr className="w-[90%] border-solid border-[1px] border-grey-200 m-[5%]" />
                    </div>
                </>
            )}

            {requirePassword && (
            <ReauthenticationComponent
                errorMessages={errorMessages}
                reauthenticateHandler={reauthenticateHandler}
                password={password}
                passwordChangeHandler={passwordChangeHandler}
            />
            )}

                    {status === 'authenticated' && userData.role !== 'customer' && (
                        <div className="text-center mt-[50px]">
                            <h2 className="text-red-600 font-bold text-lg">Only customers can post reviews.</h2>
                        </div>
                    )}
                    {reviews?.length > 0 && (
                        <div className="flex justify-center pt-4">
                            <h2 className="text-3xl font-bold text-primary text-center mb-6">Reviews</h2>
                        </div>
                    )}
                    {reviews?.length > 0 && reviews.map((review, idx) => (
                        <div key={idx} className="flex justify-center pt-12">
                            <div className="w-full max-w-2xl bg-background border border-secondary rounded-xl p-6 mb-8 shadow-lg">
                                <div className="flex items-center mb-4">
                                    <span className="font-semibold text-lg text-primary">{review.user}</span>
                                    <div className="flex ml-4 text-yellow-400">
                                        {Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}
                                        {Array.from({ length: 5 - review.rating }).map((_, i) => <span key={i}>☆</span>)}
                                    </div>
                                </div>
                                <p className="text-base text-foreground italic mb-4">“{review.comment}”</p>
                                {(review.user === userName || userRole === "admin") && (
                                    <div className="flex gap-4">
                                        <button className="px-4 py-2 bg-primary text-foreground rounded-lg font-semibold" onClick={() => setIsEditing(true)}>Edit</button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold" onClick={deleteHandler}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isEditing && reviews.map((review) => (
                        review.user === userName && (
                            <div className="w-full flex justify-center">
                                <form className="w-[70%]" onSubmit={editHandler}>
                                    <div className="mt-[50px]">
                                        <input className="placeholder-accent inline-block border-[2px] border-solid  bg-background h-[70px] rounded-[20px] p-[3%] m-[1%_5px_1%_0] w-[20%] font-bold" type="number" onChange={editChangeHandler} placeholder="Edit Rating" required min="0" max="5" name="rating"   />
                                        <input className="placeholder-accent inline-block border-[2px] border-solid  bg-background h-[70px] rounded-[20px] p-[3%] m-[1%_2px_1%_0] w-[79%] font-bold" type="text" onChange={editChangeHandler} placeholder="Edit your Review" required name="comment" />
                                    </div>
                                    <br />
                                    <button className="h-[50px] w-full rounded-[50px] border-[2px] border-solid border-accent bg-accent text-foreground hover:text-accent hover:bg-background font-xl cursor-pointer" type="submit"><b>+ Edit your Review</b></button>
                                </form>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
        
    );
}
