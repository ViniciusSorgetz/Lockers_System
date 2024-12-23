"use client";

import { api } from "@/app/axios/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "universal-cookie";

type AuthContextType = {
    isAuthenticated : boolean,
    signIn: (data: SignInData) => Promise<void>
}

type SignInData = {
    name: string,
    password: string
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthWrapper = ({children} : {children : React.ReactNode}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    
    const signIn = async (data : SignInData) : Promise<void> => {
        
        const resp = await axios.post("/api/auth/login", data);
        const token = resp.data.token as string;
        const cookies = new Cookies(null, { path : "/" });
        cookies.set("lockersSystem-token", token, {
            maxAge: 60 * 60 * 24 * 180 // 180 days / about 6 months
        });
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
        setIsAuthenticated(true);
        router.push("/armarios");
    }

    const checkToken = () => {
        const cookies = new Cookies(null, { path: "/" });
        const tokenCookie = cookies.get("lockersSystem-token");
        if(!tokenCookie){
            router.push("/login");
            return;
        }
        setIsAuthenticated(true);
    }

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
        if (!context) {
            throw new Error("useAuthContext must be used within a AuthProvider");
        }
    return context;
}
