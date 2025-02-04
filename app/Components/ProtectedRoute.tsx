'use client'
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [token, router]);

    if (!token) return null; // Return nothing until the redirect happens

    return <>{children}</>;
};

export default ProtectedRoute;
