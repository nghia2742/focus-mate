"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { signInWithGoogle, signInWithEmail, user, loading } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false); // Rename for clarity
    const [error, setError] = useState("");

    // If user is already logged in, redirect to overview
    useEffect(() => {
        if (user && !loading) {
            router.push("/overview");
        }
    }, [user, loading, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setSubmitting(true);
        setError("");
        try {
            await signInWithEmail(data.email, data.password);
            // router.push("/overview"); // Handled by useEffect
        } catch (err: any) {
            if (err.code === 'auth/invalid-credential') {
                setError("Invalid email or password");
            } else {
                setError("Failed to sign in. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            router.push("/overview");
        } catch (error) {
            console.error(error);
            setError("Failed to sign in with Google");
        }
    };

    return (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-white/50 text-sm">Login to your Focus Mate account</p>
            </div>

            <div className="space-y-4">
                <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-11"
                    onClick={handleGoogleLogin}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Login with Google
                </Button>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/50 px-2 text-white/40">Or continue with</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...register("email")}
                    />
                    {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-blue-400 hover:text-blue-300">
                            Forgot your password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...register("password")}
                    />
                    {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
                </div>

                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-white/50">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-white hover:underline font-medium">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
