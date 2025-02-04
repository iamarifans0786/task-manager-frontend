'use client'
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Context/AuthContext";

function MyApp({ children }: any) {
    return (
        <AuthProvider>
            <ToastContainer />
            {children}
        </AuthProvider>
    );
}

export default MyApp;
