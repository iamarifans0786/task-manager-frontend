"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../Components/Common/InputField";
import axios from "axios";
import { path } from "../Helper/Path";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAuth } from "../Context/AuthContext";
import { BtnLoader } from "../Helper/SvgProvider";
import { showErrorMessage, showSuccessMessage } from "../Helper/utils";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function LoginPage() {
    const router: AppRouterInstance = useRouter();
    const { login, token } = useAuth();
    const methods = useForm({ resolver: yupResolver(schema) });
    const [isLoader, setIsLoader] = useState(false)

    const onSubmit = async (data: any) => {
        setIsLoader(true)
        await axios.post(path.login, data)
            .then((res) => {
                login(res?.data?.data?.user, res?.data?.data?.token);
                showSuccessMessage("Login successful!")
            }).catch((error) => {
                showErrorMessage(error?.response?.data?.message)
                console.log(error)
            }).finally(() => {
                setIsLoader(false)
            })
    };

    useEffect(() => {
        if (token) router.push("/");
    }, [token, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-6">
            <div className="w-full max-w-xl p-8 rounded-lg shadow-md bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-white">Login</h2>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                        <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
                        <InputField label="Password" name="password" type="password" placeholder="••••••••" />
                        <button type="submit" disabled={isLoader} className="btn btn-primary">
                            {isLoader ? <BtnLoader /> : 'Login'}
                        </button>
                    </form>
                </FormProvider>
                <p className="flex items-center justify-center gap-1 mt-4 text-center text-base text-white">
                    {`  Don't have an account?`}
                    <a href="/register" className="font-semibold hover:underline text-primary">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
}
