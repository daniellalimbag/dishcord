"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { logMessage } from "../lib/logger"; 
import { useState, useEffect } from "react";

export default function first() {
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState("light");
    useEffect(() => {
      const stored = localStorage.getItem("theme") || "light";
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      // handle scroll state
      const handleScroll = () => setScrolled(window.scrollY > 0);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const toggleTheme = () => {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };

    const session = useSession();
    const status = session?.status;
    const userData = session.data?.user;
    const userName = userData?.username;
    const userPicture = userData?.profile_picture;
    const userRole = userData?.role;

    return (
        <>
            <div className={`fixed flex h-[60px] w-full transition-colors duration-500 ease-in-out transition-shadow ${(scrolled || theme === 'light') ? 'bg-background shadow-lg' : 'bg-transparent'} z-10`}>
                <div className="flex w-[15%]">
                    <Link href="/">
                        <img
                            src="/assets/logo.svg"
                            className="h-[50%] cursor-pointer m-[40%_40%_40%_100%]">
                        </img>
                    </Link>
                    <h1 className={`text-[24px] font-semibold m-auto hover:text-primary ${scrolled ? 'text-text' : 'text-accent'}`}>
                        <Link href="/">Dishcord</Link>
                    </h1>
                </div>
                <div className="flex w-[40%] justify-center items-center">
                    <div className="flex items-stretch w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`flex-grow px-3 py-2 h-full border border-secondary rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary ${scrolled ? 'bg-background text-text' : 'bg-white text-gray-800'}`}
                        />
                        <button
                            type="button"
                            className="px-4 py-2 h-full border border-accent border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center bg-accent text-text"
                        >
                            <img src="/search.svg" alt="Search" className="w-5 h-5 mx-auto" />
                        </button>
                    </div>
                </div>
                <div className="flex w-[45%]">
                    <div className="justify-end flex w-full items-center justify-start m-auto-[5%]">
                        <div className="group relative float-left">
                            <button className={`border-none outline-none bg-inherit ${scrolled ? 'text-text' : 'text-accent'}`}>
                                <h2 className="text-[16px] w-full mr-[10%] no-underline font-bold hover:text-accent cursor-pointer">
                                    Dishcord on Business
                                </h2>
                            </button>
                            <div className="group-hover:block w-[100%] absolute hidden bg-background"> 
                                <Link href="/add_business" className="text-text font-bold p-[5%_5%] no-underline block text-left hover:bg-accent hover:text-background">
                                    <h4>Add a Business</h4>
                                </Link>
                            </div>
                        </div>
                        <Link href="/restaurants" className={`text-[16px] border-none ml-[3%] mr-[3%] font-bold ${scrolled ? 'text-text bg-background' : 'text-accent bg-transparent'}`}>
                            Write a Review
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full mr-2 bg-primary text-accent transition"
                        >
                            {theme === 'dark' ? (
                                <img src="/moon.svg" alt="Dark mode" className="h-5 w-5" />
                            ) : (
                                <img src="/sun.svg" alt="Light mode" className="h-5 w-5" />
                            )}
                        </button>

                        {status === 'authenticated' && userRole === "admin" && (
                            <>
                                <Link href="/logs" className={`text-accent text-[16px] border-none ml-[3%] mr-[3%] font-bold hover:text-accent ${scrolled ? 'bg-background' : 'bg-transparent'}`}>
                                    View Logs
                                </Link>
                                <Link href="/" className="flex justify-center items-center h-[40px] w-[100px] rounded-[50px] text-background border-[2px] border-solid border-accent bg-accent mr-[3%] ml-[2%] cursor-pointer font-bold" 
                                    onClick={async () => { 
                                        signOut({ redirect: false }); 
                                        await logMessage(`Admin has logged out successfully`, "info", ""); 
                                    }}>
                                    Logout
                                </Link>
                            </>
                        )}

                        {status === 'authenticated' && userRole !== "admin" && (
                            <>
                                <Link href="/profile" className={`flex justify-center gap-[10px] overflow-x-auto items-center pl-[10px] pr-[10px] h-[40px] rounded-[50px] text-accent border-[2px] border-solid border-accent ml-[3%] cursor-pointer font-bold hover:bg-accent hover:text-background ${scrolled ? 'bg-background' : 'bg-transparent'}`}>
                                    <img src={userPicture} className="w-[25px] h-[25px] rounded-[25px]" />
                                    {userName}
                                </Link>
                                <Link href="/" className="flex justify-center items-center h-[40px] w-[100px] rounded-[50px] text-text border-[2px] border-solid border-accent bg-accent mr-[3%] ml-[2%] cursor-pointer font-bold" 
                                    onClick={async () => { 
                                        signOut({ redirect: false }); 
                                        await logMessage(`User ${userName} has logged out successfully`, "info", ""); 
                                    }}>
                                    Logout
                                </Link>
                            </>
                        )}

                        {status === 'unauthenticated' && (
                            <>
                                <Link href="/login" className={`flex justify-center items-center h-[40px] w-[100px] rounded-[50px] text-accent border-[2px] border-solid border-accent mr-[1%] ml-[2%] cursor-pointer font-bold hover:bg-accent hover:text-background ${scrolled ? 'bg-background' : 'bg-transparent'}`}>
                                    Login
                                </Link>
                                <Link href="/signup" className="flex justify-center items-center h-[40px] w-[100px] rounded-[50px] text-background border-[2px] border-solid border-accent bg-accent mr-[2%] ml-[1%] cursor-pointer font-bold">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <hr />
        </>
    );
}
