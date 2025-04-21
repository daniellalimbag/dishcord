"use client";

import Main_Hero from "./components/Main_Hero";
import Main_Categories from "./components/Main_Categories";
import LoginNotification from "./components/Login_Notification";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {session?.user && session.user.role !== "admin" && <LoginNotification />}
      <Main_Hero />
      <Main_Categories />
    </>
  );
}