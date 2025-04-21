"use client";
import Link from "next/link";
import {useState} from "react";
import {signIn} from "next-auth/react"; 
import {useRouter} from 'next/navigation';



export default function login() {

    const initialFormData = {
        username: '',
        password: '',
        redirect: false,
        callbackUrl: "/"
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    
    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
        
    async function submitHandler(e) {
        e.preventDefault();
        setIsLoggingIn(true);
        setError(false);

        const response = await signIn('credentials', formData);

        if (response?.error) {
            if (response.error.includes("locked")) {
                setError("locked");
            } else {
                setError("invalid");
            }
        } else if (response?.ok) {
            router.push(response.url);
        } else {
            setError("invalid");
        }
            
        setIsLoggingIn(false); 
    }


    return (
        <div className="w-full bg-background min-h-screen flex items-center justify-center px-4 sm:px-10">
            <div className="mx-auto w-full max-w-md p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg space-y-4 flex flex-col justify-center">
                    <div className="pb-4 text-center">
                    <h1 className="text-4xl font-bold text-text">Login</h1>
                    <h5 className="text-xl text-highlight mt-2 font-semibold">Unlock a world of reviews by logging in!</h5>
                    <hr className="h-[3px] bg-searchgrey m-[2%_0_5%_0]"/>
                    {error && (
                        <div className="flex items-center gap-3 bg-red-300 border border-accent rounded-full px-4 py-3 text-sm my-4">
                            <img className="w-[25px] h-[25px]" src="https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/Attention-512.png" />
                            {error === "locked" ? (
                                <h1 className="text-accent text-[16px] font-bold">
                                    Your account has been locked due to multiple failed login attempts. Please try again after 5 hours.
                                </h1>
                            ) : (
                                <h1 className="text-accent text-[16px] font-bold">
                                    Incorrect username or password. Please try again.
                                </h1>
                            )}
                        </div>
                    )}
                    <form onSubmit={submitHandler} className="form-container space-y-6">
                        <div className="inputs flex flex-col space-y-6">
                            <input className="placeholder-accent border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_0] w-full font-bold text-sm border-[var(--text)]" disabled={isLoggingIn} onChange={changeHandler} type="text" name="username" id="username" placeholder="Username" />
                            <input className="placeholder-accent border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_0] w-full font-bold text-sm border-[var(--text)]" disabled={isLoggingIn} onChange={changeHandler} type="password" name="password" id="password" placeholder="Password" />
                        </div>
                        <button className="h-[50px] w-full rounded-[50px] border-[2px] border-primary bg-primary text-foreground text-xl font-bold mt-6" type="submit" disabled={isLoggingIn}>Login</button>
                    </form>
                    <h5 className="text-right font-bold mt-6 mb-2">New to Dishcord? <Link className="no-underline text-accent font-bold" href="/signup">Sign Up Here!</Link></h5>
                    <h5 className="text-right font-bold">
                        Forgot your password? <Link className="text-accent" href="/forgot_password">Change It Here!</Link>
                    </h5>
                </div>
            </div>
        </div>
    );
}
