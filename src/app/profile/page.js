"use client";
import {useSession} from "next-auth/react";
import {redirect} from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";


export default function page() {
    const { data: session, status } = useSession(); 
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        phone_number: '',
        address: '',
        zip_code: '',
        city: '',
        
    });


    const [userData,setUserData] = useState(null);
    useEffect(() => {}, [session]);
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch('/api/register');
            const data = await response.json();
            const foundUser = data.find(item => item.username === session.user.username);
            setUserData(foundUser);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        if (session) {
          fetchUserData();
        }
      }, [session]);
    
      useEffect(() => {
        if (userData) {
          console.log('userData:', userData);

          setUser({
          firstname: userData.firstname,
          lastname: userData.lastname,
          username: userData.username,
          email: userData.email,
          phone_number: userData.phone_number,
          address: userData.address,
          zip_code: userData.zip_code,
          city: userData.city,
          country: userData.country,
          });
        }
      }, [userData]);
    
    
    const changeHandler = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    async function profileHandler(e) {
        e.preventDefault();

        const response = await fetch('/api/register', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        })

        window.location = "/";
    }

    if(status == "loading"){
        return (
          <>
            <div>Loading...</div>
          </>      
        ); 
    }

    if(status === 'unauthenticated'){
        return redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background relative">
            {status === 'authenticated' && userData && (
                <>
                    
                    <div className="absolute w-[40%] top-[55%] left-[52%] -translate-x-2/4 -translate-y-2/4 p-[5%] leading-[45px] text-center">
                        <h1 className="text-3xl font-bold">Your Profile</h1>   
                        <h4 className="text-base text-highlight pt-[1%] font-bold">Check or edit your current information</h4>
                        <hr className="h-[3px] bg-searchgrey m-[2%_0_5%_0]" />
                        <div className="flex flex-row">
                            <form className="w-full" onSubmit={profileHandler}>
                                <div className="flex gap-2 mb-2">
                                    <input className="placeholder-accent border-2 border-solid bg-background h-10 rounded-lg p-2 w-1/2 font-bold" disabled={true} value={userData.firstname} type="text" name="firstname" id="firstname" placeholder="First Name" />
                                    <input className="placeholder-accent border-2 border-solid bg-background h-10 rounded-lg p-2 w-1/2 font-bold" disabled={true} value={userData.lastname} type="text" name="lastname" id="firstname" placeholder="Last Name" />
                                </div>
                                <input className="placeholder-accent border-[2px] border-solid bg-background h-10 rounded-lg p-2 m-[1%_0_1%_0] w-full font-bold" disabled={true} value={userData.username} type="text" name="username" id="username" placeholder="Username" /><br />
                                <input className="placeholder-accent border-[2px] border-solid bg-background h-10 rounded-lg p-2 m-[1%_0_1%_0] w-full font-bold" disabled={true} value={userData.email} type="text" id="username" placeholder="Email" /><br />
                                <input className="placeholder-accent border-[2px] border-solid bg-background h-10 rounded-lg p-2 m-[1%_0_1%_0] w-full font-bold" type="text" value={user.phone_number} onChange={changeHandler} name="phone_number" placeholder="Phone Number" /><br />
                                <input className="placeholder-accent border-2 border-solid bg-background h-10 rounded-lg p-2 mb-2 w-full font-bold" type="text" value={user.address} onChange={changeHandler} name="address" placeholder="Address" />
                                <div className="flex gap-2 mb-2">
                                    <input className="placeholder-accent border-2 border-solid bg-background h-10 rounded-lg p-2 w-1/2 font-bold" value={user.zip_code} onChange={changeHandler} name="zip_code" type="text" placeholder="Zip Code" />
                                    <input className="placeholder-accent border-2 border-solid bg-background h-10 rounded-lg p-2 w-1/2 font-bold" value={user.city} onChange={changeHandler} name="city" type="text" placeholder="City" />
                                </div>
                                <input className="placeholder-accent border-[2px] border-solid bg-background h-10 rounded-lg p-2 m-[1%_0_1%_0] w-full font-bold" type="text" value={user.country} onChange={changeHandler} name="country" placeholder="Country" /><br />
                                <button className="w-full rounded-lg border-2 border-accent bg-accent text-foreground text-lg font-bold cursor-pointer mt-4 py-2 px-4 text-center" type="submit"><b>Save</b></button>
                                <button
                                    className="w-full rounded-lg border-2 border-accent bg-accent text-foreground text-lg font-bold cursor-pointer mt-4 py-2 px-4 text-center"
                                    type="button"
                                    onClick={() => window.location.href = `/forgot_password?username=${userData.username}`}
                                >
                                    Change Password
                                </button>
                            </form>
                        </div>
                        </div>
                </>
            )}
        </div>
    );
}
