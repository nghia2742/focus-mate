"use client";

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
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AuthButton() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error signing in with Google: " + error.message);
            } else {
                toast.error("An unknown error occurred during sign in");
            }
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        toast.success("Signed out successfully");
    };

    if (loading) return <div className="w-8 h-8 rounded-full animate-pulse inner-glass-bg" />;

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="outline-none focus:ring-2 focus:ring-primary/20 rounded-full transition-transform hover:scale-105">
                        <Avatar className="h-8 w-8 inner-glass-border shadow-lg">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="inner-glass-bg backdrop-blur-md glass-text font-bold text-xs">
                                {user.user_metadata?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-heavy backdrop-blur-xl inner-glass-border glass-text" align="end">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                            <p className="text-xs leading-none glass-text-faint">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="inner-glass-bg" />
                    <DropdownMenuItem className="focus:inner-glass-bg-hover cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:inner-glass-bg-hover cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="inner-glass-bg" />
                    <DropdownMenuItem
                        className="focus:bg-red-500/20 text-red-500 cursor-pointer"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button
            variant="ghost"
            onClick={handleGoogleLogin}
            className="glass-panel backdrop-blur-md inner-glass-border hover:inner-glass-bg-hover glass-text gap-2 h-8 px-3 rounded-full shadow-lg transition-all flex items-center text-xs"
        >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="hidden sm:inline font-medium leading-none">Google</span>
        </Button>
    );
}
