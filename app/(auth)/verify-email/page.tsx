"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login"); // Redirect if not signed in (should come from SignUp)
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    const handleResend = async () => {
        if (auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                setSent(true);
            } catch (error) {
                console.error("Error sending email", error);
            }
        }
    };

    return (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40 text-center">
            <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-400" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-white/60 mb-8">
                We&apos;ve sent a verification link to <span className="font-medium text-white">{user?.email}</span>.
                Please click the link to verify your account.
            </p>

            <div className="space-y-4">
                <Link href="/login">
                    <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11">
                        Back to Login
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    className="text-white/50 hover:text-white"
                    onClick={handleResend}
                    disabled={sent}
                >
                    {sent ? "Email Sent!" : "Didn't receive the link? Resend"}
                </Button>
            </div>
        </div>
    );
}
