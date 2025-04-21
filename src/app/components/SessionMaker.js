"use client";
import {SessionProvider} from "next-auth/react";

export function SessionMaker({children}) {
    return (
        <SessionProvider>{children}</SessionProvider>
    );
}
