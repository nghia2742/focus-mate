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

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const { signUpWithEmail, signInWithGoogle, user, loading } = useAuth(); // Destructure user and loading
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false); // Rename local loading state to submitting to avoid conflict
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
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupForm) => {
        setSubmitting(true);
        setError("");
        try {
            await signUpWithEmail(data.email, data.password, data.name);
            // router.push("/overview"); // Handled by useEffect
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already in use");
            } else {
                setError("Failed to create account. Please try again.");
                console.error(err);
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
                <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
                <p className="text-white/50 text-sm">Enter your information below to create your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...register("name")}
                    />
                    {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
                </div>

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
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...register("password")}
                    />
                    {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <span className="text-xs text-red-400">{errors.confirmPassword.message}</span>}
                </div>

                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/50 px-2 text-white/40">Or continue with</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-11"
                onClick={handleGoogleLogin}
            >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Sign up with Google
            </Button>

            <div className="mt-6 text-center text-sm text-white/50">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline font-medium">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
