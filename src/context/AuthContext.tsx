"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { createContext, useState } from "react";
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
    
    const signIn = async (data : SignInData) : Promise<void> => {
        try {
            const resp = await axios.post("/api/auth/login", data);
            const token = resp.data.token as string;
            const cookies = new Cookies(null, { path : "/" });
            cookies.set("lockersSystem-token", token, {
                maxAge: 60 * 60 * 24 * 180 // 180 days / about 6 months
            });
            setIsAuthenticated(true);
            redirect("/armarios");
        } 
        catch (error) {
            console.log("Algo deu errado.", error)  ;  
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}
