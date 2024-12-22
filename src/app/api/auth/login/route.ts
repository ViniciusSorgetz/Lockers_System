import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";

export async function POST(request : Request): Promise<NextResponse>{
    try {
        const loginData = z.object({
            name : z.string().nonempty(),
            password: z.string().nonempty()
        });
        const { name, password } = loginData.parse(await request.json());
        const secret = process.env.SECRET as string;
        const token = jwt.sign({name}, secret) // without expiration value;
        return NextResponse.json(
            { token },
            { status: 200 }
        )
    } 
    catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao fazer login. Tente novamente mais tarde." },
            { status: 500 }
        )
    }
}