"use client";
import Link from "next/link";
import { useState } from "react";
import {useSession} from "next-auth/react";
import { logMessage } from "../lib/logger";

export default function page() {
    const session = useSession();
    const status = session?.status
    const userData = session.data?.user;
    const userName = userData?.username;
    const userRole = userData?.role;
    const initialFormData = {
        name: '',
        rating: '',
        address: '',
        price_range: '',
        tags: '',
        resto_image: '',
        description: ''
    };

    const formData = {
        name: '',
        rating: '',
        address: '',
        price_range: '',
        tags: [],
        resto_image: '',
        description: '',
        owner: '',
    };

    const [placeholder, setPlaceholder] = useState(initialFormData);
    const [addedBusiness, setAddedBusiness] = useState(false);
    const [requirePassword, setRequirePassword] = useState(false);
    const [password, setPassword] = useState("");
    const [errorMessages, setErrorMessages] = useState([]);
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setPlaceholder({
            ...placeholder,
            [name]: value,
        });
    };
    
    const passwordChangeHandler = (e) => {
        setPassword(e.target.value);
    };

    async function submitHandler(e) {
        e.preventDefault();
        setAddedBusiness(false);
    
        const errors = [];
    
        const textRegex = /^[a-zA-Z0-9\s]*$/;
        if (!textRegex.test(placeholder.address)) {
            errors.push("Address should not contain special characters.");
        }
        if (!textRegex.test(placeholder.description)) {
            errors.push("Description should not contain special characters.");
        }
    
        const priceRegex = /^PHP\s?(\d+(?:\.\d{2})?)\s?-\s?PHP\s?(\d+(?:\.\d{2})?)$/i;
        const match = placeholder.price_range.match(priceRegex);
    
        if (!match) {
            logMessage(
                `Price range format validation failed. User: "${userName}"."`,
                "warning",
                ""
            );
            errors.push('Price range format should be like "PHP 80.00 - PHP 200.00".');
        } else {
            const lower = parseFloat(match[1]);
            const upper = parseFloat(match[2]);
    
            if (isNaN(lower) || isNaN(upper) || lower < 50 || upper > 5000 || lower > upper) {
                logMessage(
                    `Price range values validation failed. User: "${userName}".`,
                    "warning",
                    ""
                );
                errors.push('Invalid price range format. Please use the format: "PHP XX.XX - PHP XX.XX", where each "XX.XX" represents the price in numeric form.');
            }
        }
    
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }
        setRequirePassword(true);
    }

    async function reauthenticateHandler(e) {
        e.preventDefault();
        setErrorMessages([]);
    
        try {
            const authenticationResponse = await fetch("/api/authentication", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userName,
                    password,
                }),
            });
    
            const result = await authenticationResponse.json();
    
            if (authenticationResponse.ok) {
                const formData = {
                    name: placeholder.name,
                    rating: placeholder.rating,
                    address: placeholder.address,
                    price_range: placeholder.price_range,
                    tags: placeholder.tags.split(","),
                    resto_image: placeholder.resto_image,
                    description: placeholder.description,
                    owner: userName,
                };
    
                const addBusinessResponse = await fetch("/api/restaurants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
    
                if (addBusinessResponse.ok) {
                    setAddedBusiness(true);
                    setRequirePassword(false);
                    await logMessage(`User ${userName} successfully reauthenticated and added a business`, "info", "");
                } else {
                    const errorText = "Failed to add business. Please try again.";
                    setErrorMessages([errorText]);
                    await logMessage(`User ${userName} reauthentication succeeded, but failed to add business`, "error", errorText);
                }
            } else {
                const errorText = result.error || "Invalid credentials. Please try again.";
                setErrorMessages([errorText]);
                await logMessage(`User ${userName} reauthentication failed`, "error", errorText);
            }
        } catch (error) {
            console.error(error);
            const errorText = "An unexpected error occurred. Please try again.";
            setErrorMessages([errorText]);
            await logMessage(`Unexpected error during reauthentication for ${userName}`, "error", error.message);
        }
    }    

    return (
        <div>
            {status === 'authenticated' && (userRole == 'manager' || userRole == 'admin') && (
                <div className="relative w-full h-screen bg-background">
                    {!addedBusiness && !requirePassword && (
                        <>
                            <div className="absolute w-[40%] top-[55%] left-[50%] -translate-x-2/4 -translate-y-2/4 p-[5%] leading-[40px] text-center">
                                <h1 className="text-3xl font-bold">Add a Business</h1>   
                                <h4 className="text-base text-highlight pt-1 font-bold">Share your food with the world!</h4>
                                <hr className="h-[3px] bg-searchgrey m-[2%_0_5%_0]" />
                                <div className="form-container">
                                    <form onSubmit={submitHandler} id="signup-form">
                                        <div className="inputs">
                                            <input className="placeholder-gray-500 inline-block border-[2px] border-solid  bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_2px_1%_0] w-full font-bold" type="text" name="name" value={placeholder.name} onChange={changeHandler} placeholder="Business Name" required  />
                                            <input className="placeholder-gray-500 inline-block border-[2px] border-solid  bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_2px_1%_0] w-full font-bold" type="text" name="address" value={placeholder.address} onChange={changeHandler} placeholder="Address" required  /><br />
                                            <input className="placeholder-gray-500 border-[2px] border-solid  bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_3%_1%_0] w-full font-bold" type="text" name="tags" value={placeholder.tags} onChange={changeHandler} placeholder="Tags ( Categ1,Categ2,Categ3... )" required  />
                                            <input className="placeholder-gray-500 inline-block border-[2px] border-solid  bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_2px_1%_0] w-full font-bold" type="text" name="price_range" value={placeholder.price_range} onChange={changeHandler} placeholder="Price Range (PHP XX.XX - PHP XX.XX)" required  />
                                            <input className="placeholder-gray-500 inline-block border-[2px] border-solid  bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_2px_1%_0] w-full font-bold" value={placeholder.resto_image} type="text" name="resto_image" onChange={changeHandler} placeholder="Image Link" required  /><br />
                                            <input className="placeholder-gray-500 inline-block border-[2px] border-solid  bg-background h-[100px] rounded-[30px] p-[3%] m-[1%_2px_1%_0] w-full font-bold" type="text" name="description" value={placeholder.description} onChange={changeHandler} placeholder="Description"  />
                                        </div>
                                        <button className="h-[50px] w-full rounded-[50px] border-[2px] mt-[20px] border-solid border-primary bg-primary text-foreground font-xl cursor-pointer" type="submit" ><b>Add Business</b></button>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                    {requirePassword && !addedBusiness && (
                        <>
                            {/* background via CSS gradient on parent */}
                            <div className="absolute w-[40%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-[5%] bg-slate rounded-[20px] shadow-lg">
                                <div className="flex justify-center items-center mb-[20px]">
                                    <h1 className="text-[40px] font-bold text-accent">Reauthenticate</h1>
                                </div>
                                {errorMessages.length > 0 && (
                                    <div className="flex flex-col w-full bg-muted p-3 border border-accent rounded-[10px] mb-[20px]">
                                        {errorMessages.map((error, index) => (
                                            <p key={index} className="text-accent font-bold text-[14px]">
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                <form onSubmit={reauthenticateHandler} className="flex flex-col items-center">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={passwordChangeHandler}
                                        placeholder="Enter your password"
                                        className="w-[80%] p-[15px] border-[2px] border-solid  rounded-[50px] text-[18px] mb-[20px] focus:outline-none focus:ring-2 focus:ring-accent"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-[80%] h-[50px] rounded-[50px] bg-accent text-foreground font-bold text-[18px] hover:bg-red-700 transition-all"
                                    >
                                        Confirm
                                    </button>
                                </form>
                            </div>
                        </>
                    )}

                    {addedBusiness && (
                        <>
                            {/* background via CSS gradient on parent */}
                            <div className="absolute w-[40%] top-[60%] left-[53%] -translate-x-2/4 -translate-y-2/4 p-[5%] leading-[65px]">
                                <div className="absolute w-full top-[55%] left-[50%] -translate-x-2/4 -translate-y-2/4 p-[5%] leading-[50px]">
                                    <h1 className="text-3xl font-bold">Business Added!</h1>
                                    <h4 className="text-base text-highlight pt-1 font-bold">To return to Homepage, click <Link href="/" className="text-accent underline">here</Link></h4>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            {status === 'unauthenticated' && (
                <div className="min-h-screen bg-background relative flex items-center justify-center">
                    <div className="absolute w-full top-[55%] left-[50%] -translate-x-2/4 -translate-y-2/4 p-[5%] leading-[50px]">
                        <h1 className="text-3xl font-bold">Uh oh! Seems like you are not logged in.</h1>
                        <h4 className="text-base text-highlight pt-1 font-bold">You must first login <Link href="/login" onClick={() => setAddedBusiness(false)} className="text-accent underline">here</Link></h4>
                    </div>
                </div>
            )}
            {status === 'authenticated' && userRole == 'customer' && (
                <div className="min-h-screen bg-gbackground relative flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-[5%]">
                        <h1 className="text-3xl font-bold">Access Denied</h1>
                        <h4 className="text-base text-highlight pt-1 font-bold">
                            Only managers can add or edit businesses.
                        </h4>
                    </div>
                </div>
            )}
        </div>
    );
}