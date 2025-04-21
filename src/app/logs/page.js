"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { logMessage } from "../lib/logger";

export default function LogsPage() {
    const session = useSession();
    const status = session?.status;
    const userData = session.data?.user;
    const userRole = userData?.role;

    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (status === "authenticated" && userRole !== "admin") {
            logMessage(
                `Unauthorized access attempt to /logs by user ${userData.username} with role ${userRole}`,
                "warning",
                ""
            );
        } else if (status === "unauthenticated") {
            logMessage(
                `Unauthorized access attempt to /logs by an unauthenticated user`,
                "warning",
                ""
            );
        }
    }, [status, userRole, userData]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch("/api/logs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                } else {
                    console.error("Failed to fetch logs");
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated" && userRole === "admin") {
            fetchLogs();
        }
    }, [status, userRole]);

    return (
        <div>
            {status === 'authenticated' && userRole === 'admin' && (
                <div className="bg-background min-h-screen py-10 px-4">
                    <div className="max-w-3xl mx-auto bg-background p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-accent text-center mb-2">Admin Logs</h1>
                        <p className="text-lg text-highlight text-center mb-4">Welcome to the logs page, admin!</p>
                        <hr className="border-t border-searchgrey mb-6" />
                        {isLoading ? (
                            <p className="text-base text-searchgrey text-center">Loading logs...</p>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {logs.length > 0 ? (
                                    <ul className="space-y-2">
                                        {logs.map((log, index) => (
                                            <li key={log._id || index} className="bg-slate p-4 rounded-md shadow-sm">
                                                <p className="text-sm"><strong>Message:</strong> {log.message}</p>
                                                <p className="text-sm"><strong>Level:</strong> {log.level}</p>
                                                <p className="text-sm"><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-base text-searchgrey text-center">No logs found.</p>
                                )}
                            </div>
                        )}
                        <Link href="/" className="block bg-accent text-foreground px-4 py-2 rounded-full font-bold hover:bg-searchgrey mx-auto mt-6 w-max">Return to Homepage</Link>
                    </div>
                </div>
            )}

            {status === 'authenticated' && userRole !== 'admin' && (
                <div className="bg-background min-h-screen relative">
                    {/* Access Denied Content */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-[5%]">
                        <h1 className="text-[50px] font-bold text-accent">Access Denied</h1>
                        <h4 className="text-[20px] text-highlight pt-[1%] font-bold">You do not have permission to view this page.</h4>
                        <Link href="/" className="flex justify-center items-center h-[40px] w-[200px] rounded-[50px] text-foreground border-[2px] border-solid border-accent bg-accent mt-[20px] cursor-pointer font-bold hover:bg-searchgrey">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            )}

            {status === 'unauthenticated' && (
                <div className="bg-background min-h-screen relative">
                    {/* Not Logged In Content */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-[5%]">
                        <h1 className="text-[50px] font-bold text-accent">Please Log In</h1>
                        <h4 className="text-[20px] text-highlight pt-[1%] font-bold">You need to be logged in to view this page.</h4>
                        <Link href="/login" className="flex justify-center items-center h-[40px] w-[200px] rounded-[50px] text-foreground border-[2px] border-solid border-accent bg-accent mt-[20px] cursor-pointer font-bold hover:bg-searchgrey">
                            Go to Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
