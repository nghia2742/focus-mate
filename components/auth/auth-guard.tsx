"use client";

import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";
import { AuthButton } from "./auth-button";

interface AuthGuardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  className,
  title = "Sign in to access",
  description = "Connect your account to sync and track your progress."
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[200px] gap-3", className)}>
        <Loader2 className="size-6 text-white/20 animate-spin" />
        <p className="text-xs glass-text-faint">Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={cn("relative group overflow-hidden rounded-[32px]", className)}>
        {/* Blurred Background Preview */}
        <div className="opacity-10 grayscale blur-xl select-none pointer-events-none">
          {children}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/5 backdrop-blur-[2px]">
          <div className="size-14 rounded-2xl glass flex items-center justify-center mb-6 shadow-xl ring-1 ring-white/10">
            <Lock className="size-6 glass-text" />
          </div>

          <div className="space-y-2 mb-8 max-w-[240px]">
            <h3 className="text-xl font-bold glass-text tracking-tight">{title}</h3>
            <p className="text-sm glass-text-faint leading-relaxed">
              {description}
            </p>
          </div>

          <div className="scale-110">
            <AuthButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
