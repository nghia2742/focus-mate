"use client";

import { auth, db } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
    User
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signUpWithEmail: async () => { },
    signInWithEmail: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const createUserDocument = async (user: User, additionalName?: string) => {
        if (!user) return;
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName || additionalName,
                photoURL: user.photoURL,
                lastSeen: serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error creating user document:", error);
            // Don't block auth flow if firestore fails
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);

            // Sync Google Photo if missing or different
            // This handles cases where user signed up with email first (no photo) then used Google
            const googleProfile = result.user.providerData.find(p => p.providerId === GoogleAuthProvider.PROVIDER_ID);
            if (googleProfile?.photoURL && result.user.photoURL !== googleProfile.photoURL) {
                await updateProfile(result.user, { photoURL: googleProfile.photoURL });
            }

            // Manually set user to prevent race condition
            setUser(result.user);

            await createUserDocument(result.user);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, pass: string, name: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass);

            // Manually set user to prevent race condition with router.push
            setUser(result.user);

            // Update Display Name
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: name });
            }

            // Create doc in parallel
            await createUserDocument(result.user, name);

            // Send verification email in background
            import("firebase/auth").then(({ sendEmailVerification }) => {
                if (result.user) sendEmailVerification(result.user).catch(console.error);
            });
        } catch (error) {
            console.error("Error signing up", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
