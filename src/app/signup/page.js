"use client";
import Link from "next/link";
import {useState} from "react";
import { logMessage } from "../lib/logger";
import { signIn } from "next-auth/react";

export default function signup() {


    const initialFormData = {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        profile_picture: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
        confirmpassword: '',
        phone_number: '',
        address: '',
        zip_code: '',
        city: '',
        country: '',
        role: 'customer',
    };

    function checkPassword(pass) {
        const letterRegex = /[a-zA-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

        if (pass.length < 8) {
            return false;
        }

        if (!letterRegex.test(pass) || !numberRegex.test(pass) || !specialCharRegex.test(pass)) {
            return false;
        }

        return true;
    }

    

    const [formData, setFormData] = useState(initialFormData);

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isQuestionCreated, setIsQuestionCreated] = useState(false);
    const [isUserCreated, setIsUserCreated] = useState(false);
    const [passError, setPassError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [confirmPassError, setConfirmPassError] = useState(false);
    const [securityQuestion1, setSecurityQuestion1] = useState('');
    const [securityAnswer1, setSecurityAnswer1] = useState('');
    const [securityQuestion2, setSecurityQuestion2] = useState('');
    const [securityAnswer2, setSecurityAnswer2] = useState('');
    const [step, setStep] = useState(1);


    async function submitHandler(e) {
        e.preventDefault();
        setPassError(false);
        setUsernameError(false);
        setConfirmPassError(false);
        setIsCreatingUser(true);
        setIsUserCreated(false);
    
        if (formData.password !== formData.confirmpassword) {
            setConfirmPassError(true);
            setIsCreatingUser(false);
            return;
        } else if(!checkPassword(formData.password)){
            setPassError(true);
            setIsCreatingUser(false);
            return;
        } else if(formData.username.length < 6){
            setUsernameError(true);
            setIsCreatingUser(false);
            return;
        } else if(!securityQuestion1 && !securityAnswer1 && !securityQuestion2 && !securityAnswer2){
            setIsQuestionCreated(false);
            setIsCreatingUser(false);
            return;
        } else {
            const { confirmpassword, ...dataToSend } = formData;
        
            dataToSend.securityQuestion1 = [
                {
                    question: securityQuestion1,
                    answer: securityAnswer1
                }
            ];
        
            dataToSend.securityQuestion2 = [
                {
                    question: securityQuestion2,
                    answer: securityAnswer2
                }
            ];
        
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(dataToSend),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            if (response.ok) {
                setIsUserCreated(true);
                setStep(3);
                setIsCreatingUser(false);
                await logMessage(`User ${formData.username} just joined`, "info", "");
            } else {
                setIsCreatingUser(false);
                setFormData(initialFormData);
            }
        }
    }

    return (
        <>
            <div className="w-full bg-background min-h-screen pt-20 px-10">
                {step === 1 && !isUserCreated && (
                    <div className="mx-auto w-full max-w-md p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg space-y-4 flex flex-col justify-center">
                        <div className="pb-4 border-b border-gray-300 text-center">
                            <h1 className="text-4xl font-bold text-text">Sign Up</h1>
                            <h5 className="text-xl text-highlight mt-2 font-semibold">Dish out your hottest takes</h5>
                        </div>
                        {confirmPassError && (
                            <div className="flex items-center gap-2 bg-red-600 border border-red-600 rounded-full px-4 py-2 text-xs">
                                <img className="w-6" src="/alert.svg" alt="Alert" />
                                <span className="text-xs text-white">Password and Confirm Password Mismatch</span>
                            </div>
                        )}
                        {passError && (
                            <div className="flex items-center gap-2 bg-red-600 border border-red-600 rounded-full px-4 py-2 text-xs">
                                <img className="w-6" src="/alert.svg" alt="Alert" />
                                <span className="text-xs text-white">Password must be at least 8 characters long, have letters, numbers, and a special character</span>
                            </div>
                        )}
                        {usernameError && (
                            <div className="flex items-center gap-2 bg-red-600 border border-red-600 rounded-full px-4 py-2 text-xs">
                                <img className="w-6" src="/alert.svg" alt="Alert" />
                                <span className="text-xs text-white">Username must be at least 6 characters long</span>
                            </div>
                        )}
                        <div className="form-container space-y-4">
                            <div className="inputs">
                                <input className="placeholder-accent inline-block border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_2px_1%_0] w-[49.5%] font-bold text-sm text-[var(--text)]" type="text" name="firstname" value={formData.firstname} onChange={changeHandler} id="firstname" placeholder="First Name" required disabled={isCreatingUser} />
                                <input className="placeholder-accent inline-block border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_2px_1%_0] w-[49.5%] font-bold text-sm text-[var(--text)]" type="text" name="lastname" value={formData.lastname} onChange={changeHandler} id="lastname" placeholder="Last Name" required disabled={isCreatingUser} /><br />
                                <input className="placeholder-accent border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_0_1%_0] w-full font-bold text-sm text-[var(--text)]" type="text" name="username" value={formData.username} onChange={changeHandler} id="username" placeholder="Username" required disabled={isCreatingUser} /><br />
                                <input className="placeholder-accent border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_0_1%_0] w-full font-bold text-sm text-[var(--text)]" type="email" name="email" value={formData.email} onChange={changeHandler} id="email" placeholder="Email" required disabled={isCreatingUser} /><br />
                                <input className="placeholder-accent border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_0_1%_0] w-full font-bold text-sm text-[var(--text)]" type="password" name="password" value={formData.password} onChange={changeHandler} id="password" placeholder="Password" required disabled={isCreatingUser} /><br />
                                <input className="placeholder-accent border-[2px] border-solid bg-transparent h-10 rounded-[50px] p-[3%] m-[1%_0_1%_0] w-full font-bold text-sm text-[var(--text)]" type="password" name="confirmpassword" value={formData.confirmpassword} onChange={changeHandler} id="confirmpassword" placeholder="Confirm Password" required disabled={isCreatingUser} /><br />
                                <label className="flex items-center gap-[10px] text-sm">
                                <input
                                    type="checkbox"
                                    name="role"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        role: e.target.checked ? 'manager' : 'customer'
                                    })}
                                    disabled={isCreatingUser}
                                />
                                Sign up as Manager (to manage a business or restaurant)
                            </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                                className="h-12 w-full rounded-full bg-white text-black font-semibold border border-gray-300 flex items-center justify-center gap-2 mb-4 hover:bg-gray-100"
                            >
                                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-6 w-6" />
                                <span>Sign up with Google</span>
                            </button>
                            <button
                                className="h-[50px] w-full rounded-[50px] border-[2px] border-primary border-primary bg-primary text-foreground font-xl cursor-pointer mt-6"
                                type="button"
                                onClick={() => {
                                    if (formData.password !== formData.confirmpassword) {
                                        setConfirmPassError(true);
                                        return;
                                    } else if (!checkPassword(formData.password)) {
                                        setPassError(true);
                                        return;
                                    } else if (formData.username.length < 6) {
                                        setUsernameError(true);
                                        return;
                                    }
                                    setConfirmPassError(false);
                                    setPassError(false);
                                    setUsernameError(false);
                                    setStep(2);
                                }}
                            >
                                <b>Next</b>
                            </button>                            
                        <h5 className="text-right pt-[2%] font-bold">Already on Dishcord? <Link className="no-underline text-accent font-bold" href="/login">Login Here!</Link></h5>
                    </div>
                </div>
                )}
                {step === 2 && !isUserCreated && (
                    <div className="w-full flex justify-center py-10">
                        <div className="w-full max-w-md p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-xl space-y-4 mx-auto">
                            <h1 className="text-2xl font-bold text-primary text-center">Security Questions</h1>
                            <p className="text-sm text-highlight text-center">Help us keep your account safe.</p>
                            <hr className="border-t border-searchgrey mb-4" />
                            <form onSubmit={submitHandler} className="space-y-4">
                                <input
                                    className="placeholder-accent border-2 border-secondary bg-background h-12 rounded-full px-4 w-full font-bold"
                                    type="text"
                                    placeholder="Enter your first security question"
                                    value={securityQuestion1}
                                    onChange={(e) => setSecurityQuestion1(e.target.value)}
                                    required
                                />
                                <input
                                    className="placeholder-accent border-2 border-secondary bg-background h-12 rounded-full px-4 w-full font-bold"
                                    type="text"
                                    placeholder="Answer"
                                    value={securityAnswer1}
                                    onChange={(e) => setSecurityAnswer1(e.target.value)}
                                    required
                                />

                                <input
                                    className="placeholder-accent border-2 border-secondary bg-background h-12 rounded-full px-4 w-full font-bold"
                                    type="text"
                                    placeholder="Enter your second security question"
                                    value={securityQuestion2}
                                    onChange={(e) => setSecurityQuestion2(e.target.value)}
                                    required
                                />
                                <input
                                    className="placeholder-accent border-2 border-secondary bg-background h-12 rounded-full px-4 w-full font-bold"
                                    type="text"
                                    placeholder="Answer"
                                    value={securityAnswer2}
                                    onChange={(e) => setSecurityAnswer2(e.target.value)}
                                    required
                                />

                                <button
                                    className="h-12 w-full rounded-full bg-accent text-background font-semibold hover:bg-primary"
                                    type="submit"
                                >
                                    <b>Signup</b>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {step === 3 && isUserCreated &&(
                    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-5rem)] p-10 text-center">
                        <h1 className="text-[50px] font-bold">Thank you for signing up!</h1>
                        <h4 className="text-[20px] text-highlight pt-[1%] font-bold">You may now login <Link href="/login" className="text-accent underline">here</Link></h4>
                    </div>
                )}
            </div>
        </>
    );
}