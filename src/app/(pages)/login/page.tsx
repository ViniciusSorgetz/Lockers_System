"use client"

import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
    name : z.string().nonempty("Insira um nome."),
    password : z.string().nonempty("Insira uma senha.")
});
type loginFormData = z.infer<typeof loginFormSchema>


const LoginPage = () => {

    const { signIn } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState("");

    const { handleSubmit, register, formState : {errors} } = useForm<loginFormData>({
        resolver: zodResolver(loginFormSchema)
    });
    
    const login = async (data : loginFormData) => {
        try {
            await signIn(data);
        } 
        catch (error) {
            if(axios.isAxiosError(error) && error.response){
                if(error.response.status == 400){
                    setErrorMessage(error.response.data.message);
                }
            }
            console.log("Algo deu errado", error);
        }
    }
        
    return (<>            
            <form className="login-form" onSubmit={handleSubmit(login)}>
                <h4 className="text-center mb-5">Login no sistema</h4>
                <div className="form-group row mb-3">
                    <label className="col-sm-2 col-form-label">Nome</label>
                    <div className="col-sm-10">
                    <input 
                        type="text" 
                        value={"Admin"}
                        className="form-control-plaintext"
                        placeholder="nome"
                        {...register("name")}
                    />
                    {errors.name &&
                        <span className="text-danger small">
                            {errors.name.message}
                        </span>}
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label className="col-sm-2 col-form-label">Senha</label>
                    <div className="col-sm-10">
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="senha"
                        {...register("password")}
                    />
                    {errors.password &&
                        <span className="text-danger small">
                            {errors.password.message}
                        </span>}
                    {errorMessage.length > 0 && 
                        <span className="text-danger small">
                            {errorMessage}
                        </span>}
                    </div>
                </div>
                <button className="btn-cool btn-blue" style={{margin: "auto"}}>Logar</button>
            </form>
    </>);
}

export default LoginPage;