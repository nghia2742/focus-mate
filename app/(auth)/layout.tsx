"use client";

import { GlassBackground } from "@/components/theme/glass-background";
import { Timer } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-[family-name:var(--font-geist-sans)]">
            <GlassBackground />

            {/* Brand Header */}
            <div className="absolute top-8 left-0 right-0 flex justify-center z-10 animate-fade-in">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Timer className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                        Focus Mate
                    </h1>
                </Link>
            </div>

            <div className="z-10 w-full max-w-md px-4 animate-fade-in-up">
                {children}
            </div>
        </div>
    );
}
