"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { STATUS } from "@/constant/next-auth";

export function UserInitializer() {
    const { data: session, status } = useSession();
    const { setIsLoggedIn } = usePortfolioStore.getState();

    useEffect(() => {
        setIsLoggedIn(status === STATUS.AUTHENTICATED)
    }, [session, setIsLoggedIn, status]);

    return null;
}
