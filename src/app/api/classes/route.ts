import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Class from "@/app/models/Class";
import { z } from "zod";

// list classes
export async function GET() : Promise<NextResponse>{

    await dbConnect();

    try {
        const classes = await Class.find();
        return NextResponse.json(
            { classes },
            { status: 200 }
        );
    } 
    catch (error) {
        
        console.error(error);
        return NextResponse.json(
            { mensagem: "Erro ao listar turmas. Tente novamente mais tarde." }, 
            { status: 500 }
        );
    }
}

// add a class
export async function POST(request: Request) : Promise<NextResponse>{

    await dbConnect();
    const codeSchema = z.object({
        code: z.string().min(2)
    });

    try {
        const { code } = codeSchema.parse(await request.json());
        
        // checks if the class doesn't already exist
        const checkClass = await Class.findOne({code: code});

        if(checkClass){
            return NextResponse.json(
                { message: "Esta turma já existe." }, 
                { status: 400 }
            );
        }

        const createdClass = await Class.create({code});
        return NextResponse.json(
            { message: "Turma criada com sucesso.", class: createdClass}
        );
    } 
    catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
                { message: "Erro de requisição.", errors: error.issues },
                { status: 400 }
,       );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao cirar turma. Tente novamente mais tarde." }, 
            { status: 500 } 
        );
    }
}
