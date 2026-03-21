"use client";

import { AIConsultant } from "@/components/ai/ai-consultant";
import { AuthButton } from "@/components/auth/auth-button";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SettingsButton } from "@/components/settings/settings-button";
import { GlassBackground } from "@/components/theme/glass-background";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const currentView = pathname.split("/").pop() || "overview";

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="relative w-full h-screen overflow-hidden flex font-[family-name:var(--font-geist-sans)]">
            <GlassBackground />

            {/* Sidebar - Fixed Left */}
            <div className="z-20 relative h-full">
                <AppSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">

                {/* Top Header */}
                <div className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-black/5 z-20">
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                        <span>Application</span>
                        <span>/</span>
                        <span className="text-white capitalize">{currentView}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <AuthButton />
                        <SettingsButton />
                    </div>
                </div>

                {/* View Content */}
                <ScrollArea className="flex-1">
                    <div className="p-8 pb-20 max-w-6xl mx-auto h-full">
                        {children}
                    </div>
                </ScrollArea>
            </div>

            {/* Global AI Assistant (Floating) - Hide on AI page to avoid duplication */}
            {currentView !== "ai" && <AIConsultant />}
        </div>
    );
}
