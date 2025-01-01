import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Admin from "@/app/models/Admin";
import dbConnect from "@/app/db/dbConnect";

export async function POST(request : Request): Promise<NextResponse>{

    await dbConnect();

    try {
        const loginData = z.object({
            name : z.string().nonempty(),
            password: z.string().nonempty()
        });
        const { name, password } = loginData.parse(await request.json());
        const admin = await Admin.findOne({name: name});
        if(!admin) return NextResponse.json(
            { message: "Admin não encontrado." },
            { status: 404 }
        );

        const checkPassword = await bcrypt.compare(password, admin.password);
        if(!checkPassword) return NextResponse.json(
            { message: "Senha incorreta." },
            { status: 400 }
        )
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