import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Admin from "@/app/models/Admin";

export async function POST(request : Request): Promise<NextResponse>{
    try {
        const loginData = z.object({
            name : z.string().nonempty(),
            password: z.string().nonempty(),
            newPassword : z.string().nonempty().min(5),
        });
        const { name, password, newPassword } = loginData.parse(await request.json());
        const admin = await Admin.findOne({name: name});
        if(!admin) return NextResponse.json(
            { message: "Admin não encontrado." },
            { status: 404 }
        );

        const checkPassword = await bcrypt.compare(password, admin.password);
        if(!checkPassword) return NextResponse.json(
            { message: "Senha incorreta." },
            { status: 400 }
        );

        await bcrypt.hash(newPassword, 10).then(async hash => {
            admin.password = hash;
            await admin.save();
        });
        
        return NextResponse.json(
            { message: "Senha atualizada com sucesso." },
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