"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function LoginNotification() {
  const { data: session } = useSession();
  const [showNotification, setShowNotification] = useState(false);
  const [lastLoginInfo, setLastLoginInfo] = useState(null);
  
  useEffect(() => {
    if (session?.user) {
      const formatDate = (dateString) => {
        if (!dateString) return "never";
        const date = new Date(dateString);
        return date.toLocaleString();
      };
  
      setLastLoginInfo({
        lastSuccessful: formatDate(session.user.lastSuccessfulLogin),
        lastUnsuccessful: formatDate(session.user.lastUnsuccessfulLogin),
      });
  
      setShowNotification(true);
  
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [session]);  
  
  if (!showNotification || !lastLoginInfo) return null;
  
  return (
<div className="fixed top-5 right-5 bg-background shadow-lg rounded-lg p-4 border-l-4 border-accent max-w-md w-full z-50">
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <svg
        className="h-6 w-6 text-accent"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <div className="ml-3 w-auto flex-1 break-words">
      <p className="text-sm font-medium text-foreground-900">Account Activity</p>
      <p className="mt-1 text-sm text-foreground-500">
        Last successful login: {lastLoginInfo.lastSuccessful}
      </p>
      {session?.user?.lastUnsuccessfulLogin && (
      <p className="mt-1 text-sm text-foreground-500">
        Last unsuccessful login attempt: {lastLoginInfo.lastUnsuccessful}
      </p>
    )}
    </div>
    <div className="ml-4 flex-shrink-0 flex">
      <button
        className="bg-slate rounded-md inline-flex text-foreground-400 hover:text-foreground-500"
        onClick={() => setShowNotification(false)}
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
  );
}