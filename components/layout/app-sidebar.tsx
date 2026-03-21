
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    Bot,
    CheckSquare,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    StickyNote,
    Timer,
    User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { href: "/overview", label: "Overview", icon: LayoutDashboard },
        { href: "/focus", label: "Focus Zone", icon: Timer },
        { href: "/notes", label: "Notes", icon: StickyNote },
        { href: "/tasks", label: "Tasks", icon: CheckSquare },
        { href: "/ai", label: "AI Consultant", icon: Bot },
    ];

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    return (
        <div className="w-64 h-full flex flex-col glass-panel rounded-r-2xl border-r border-white/20">
            {/* Header */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                        <Timer className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                        Focus Mate
                    </h1>
                </Link>
            </div>

            <Separator className="bg-white/10" />

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1">
                <div className="text-xs font-semibold text-white/40 px-3 mb-2 uppercase tracking-wider">
                    Platform
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                            "text-sm font-medium",
                            isActive(item.href)
                                ? "bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        {isActive(item.href) && (
                            <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                        )}
                    </Link>
                ))}
            </div>

            {/* User Section */}
            <div className="p-4 mt-auto">
                <div className="glass-heavy p-3 rounded-xl border border-white/10 flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-white/20">
                        <AvatarImage src={user?.photoURL || undefined} />
                        <AvatarFallback className="bg-blue-900 text-blue-200">
                            {user?.displayName?.[0] || <UserIcon className="h-4 w-4" />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.displayName || "Guest User"}
                        </p>
                        <p className="text-xs text-white/40 truncate">
                            {user?.email || "Sign in to sync"}
                        </p>
                    </div>
                    {user ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-red-400" onClick={signOut}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-blue-400">
                            <UserIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
