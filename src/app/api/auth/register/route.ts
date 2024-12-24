import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import Admin from "@/app/models/Admin";

export async function POST(request : Request): Promise<NextResponse>{
    try {
        const loginData = z.object({
            name : z.string().trim().nonempty().min(5),
            password: z.string().trim().nonempty().min(5)
        });
        const { name, password } = loginData.parse(await request.json());
        const checkName = await Admin.findOne({name: name});
        if(checkName) return NextResponse.json(
            { message: "Documento com esse nome já existe." },
            { status: 400 }
        )
        await bcrypt.hash(password, 10).then(async hash => {
            await Admin.create({name, password: hash});
        });
        
        return NextResponse.json(
            { message: "Dados do admin criados com sucesso." },
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