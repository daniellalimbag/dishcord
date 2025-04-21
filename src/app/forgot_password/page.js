"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        securityAnswers: {},
        password: '',
        confirmPassword: '',
    });
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchUserData = async (username) => {
        try {
            const response = await fetch('/api/register');
            const data = await response.json();
            return data.find((user) => user.username === username);
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');

        if (username) {
            setFormData((prevState) => ({
                ...prevState,
                username: username,
            }));

            const loadQuestions = async () => {
                setIsLoading(true);
                try {
                    const user = await fetchUserData(username.trim());
                    if (!user) {
                        setError('Username not found. Please try again.');
                        setIsLoading(false);
                        return;
                    }

                    const retrievedQuestions = [
                        { id: 1, question: user.securityQuestion1[0]?.question || "Question not found" },
                        { id: 2, question: user.securityQuestion2[0]?.question || "Question not found" },
                    ];

                    setQuestions(retrievedQuestions);
                    setStep(2);
                } catch (err) {
                    console.error("Error during question loading:", err);
                    setError('An error occurred. Please try again later.');
                } finally {
                    setIsLoading(false);
                }
            };

            loadQuestions();
        }
    }, []);

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const user = await fetchUserData(formData.username.trim());
            if (!user) {
                setError('Username not found. Please try again.');
                setIsLoading(false);
                return;
            }

            const retrievedQuestions = [
                { id: 1, question: user.securityQuestion1[0]?.question || "Question not found" },
                { id: 2, question: user.securityQuestion2[0]?.question || "Question not found" },
            ];

            setQuestions(retrievedQuestions);
            setStep(2);
        } catch (err) {
            console.error("Error during username submission:", err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuestionsSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const user = await fetchUserData(formData.username.trim());
            if (
                user.securityQuestion1[0]?.answer !== formData.securityAnswers[1] ||
                user.securityQuestion2[0]?.answer !== formData.securityAnswers[2]
            ) {
                setError('Incorrect answers. Please try again.');
                setIsLoading(false);
                return;
            }

            setStep(3);
        } catch (err) {
            console.error("Error validating answers:", err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
    
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }
    
        const checkPasswordComplexity = (password) => {
            const letterRegex = /[a-zA-Z]/;
            const numberRegex = /[0-9]/;
            const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            return (
                password.length >= 8 &&
                letterRegex.test(password) &&
                numberRegex.test(password) &&
                specialCharRegex.test(password)
            );
        };
    
        if (!checkPasswordComplexity(formData.password)) {
            setError(
                "Password must be at least 8 characters long, include letters, numbers, and a special character."
            );
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch('/api/forgot_password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    password: formData.password,
                }),
            });
    
            if (response.ok) {
                setMessage("Password successfully reset. Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to reset password. Please try again.");
            }
        } catch (err) {
            console.error("Error resetting password:", err.message);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    
    return (
        <div className="w-full bg-background min-h-screen flex items-center justify-center px-4 sm:px-10">
            <div className="mx-auto w-full max-w-md p-8 backdrop-blur-md rounded-lg space-y-6" style={{ backgroundColor: "rgba(var(--text-rgb), 0.1)" }}>
                <h1 className="text-3xl font-bold text-primary text-center">Change Password</h1>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                
                {step === 1 && (
                    <form onSubmit={handleUsernameSubmit}>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={changeHandler}
                            className="placeholder-accent border-[2px] bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_0] w-full font-bold"
                            type="text"
                            placeholder="Enter your username"
                            disabled={isLoading}
                            required
                        />
                        <button
                            className="font-bold h-[50px] w-full bg-accent text-foreground text-xl rounded-[50px] m-[2%_0]"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Continue"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleQuestionsSubmit}>
                        {questions.map((q) => (
                            <div key={q.id} className="mt-[20px]">
                                <label className="block text-[18px] font-bold mb-[5px]">{q.question}</label>
                                <input
                                    name={`answer${q.id}`}
                                    onChange={(e) =>
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            securityAnswers: {
                                                ...prevState.securityAnswers,
                                                [q.id]: e.target.value.trim(),
                                            },
                                        }))
                                    }
                                    className="placeholder-accent border-[2px] border-solid  bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_0] w-full font-bold"
                                    type="text"
                                    required
                                />
                            </div>
                        ))}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        <button
                            className={`font-bold h-[50px] w-full bg-accent text-foreground text-xl rounded-[50px] m-[2%_0] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Validating..." : "Validate"}
                        </button>
                    </form>
                )}


                {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={changeHandler}
                            className="placeholder-accent border-[2px] bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_0] w-full font-bold"
                            type="password"
                            placeholder="New Password"
                            required
                        />
                        <input
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={changeHandler}
                            className="placeholder-accent border-[2px] bg-background h-[50px] rounded-[50px] p-[3%] m-[1%_0] w-full font-bold"
                            type="password"
                            placeholder="Confirm Password"
                            required
                        />
                        <button
                            className="font-bold h-[50px] w-full bg-accent text-foreground text-xl rounded-[50px] m-[2%_0]"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
