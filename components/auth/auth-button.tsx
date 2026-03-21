"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";

export function AuthButton() {
    const { user, signInWithGoogle, signOut } = useAuth();
    console.log("AuthButton User State:", user?.photoURL); // Debug log

    if (!user) {
        return (
            <Link href="/login">
                <Button
                    variant="ghost"
                    size="sm"
                    className="glass hover:bg-white/10 text-white"
                >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full glass hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-heavy border-white/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.displayName}</p>
                        <p className="text-xs leading-none text-white/70">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={signOut} className="text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
