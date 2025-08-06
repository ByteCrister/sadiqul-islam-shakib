"use client";

import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { Button } from "./ui/button";       // or your own btn-primary class
import { LogOut } from "lucide-react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export default function LogoutButton() {
    const { setProfile } = usePortfolioStore.getState()
    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/",
            redirect: true,
        });
        setProfile(null)
    };

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
            onClick={handleLogout}
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </Button>
    );
}
