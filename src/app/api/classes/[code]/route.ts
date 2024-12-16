import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Class, { Student } from "@/app/models/Class";
import { z } from "zod";

// adds a student to a class
export async function POST(
    request: Request, 
    { params } : { params: Promise<{ code:string }> } 
) : Promise<NextResponse>{

    await dbConnect();
    const codeSchema = z.string();
    const studentSchema = z.object({
        name: z.string().min(1),
        phone_number: z.string().min(9).optional()
    });

    try {
        const code = codeSchema.parse((await (params)).code);
        const student = studentSchema.parse(await request.json());
        const studentClass = await Class.findOne({code: code});

        if(!studentClass){
            return NextResponse.json(
                { message: "Turma não encontrada." }, 
                { status: 404 });
        }

        // checks if there isn't any student with the same name in the class
        const checkStudent = studentClass.students.find((s : Student) => s.name == student.name);
        if(checkStudent){
            return NextResponse.json(
                { menssagem: "Este aluno já está nesta turma." }, 
                { status: 409 }
            );
        }

        studentClass.students.push(student); 

        await Class.updateOne({code: code}, studentClass);
        return NextResponse.json(
            { message: "Aluno adicionado com sucesso.", student },
            { status: 201 }
        );
    } 
    catch (error) {

        if(error instanceof z.ZodError){
            return NextResponse.json(
                { message: "Erro de requisição.", errors: error.issues },
                { status: 400 }
            )
        }

        console.error(error);
        return NextResponse.json({
            message: "Requisição incorreta."
        }, {
            status: 400
        });
    }
}
/*

// editar código da turma
export async function PATCH(request: Request, context: any) {
    await dbConnect();

    try {
        const { codigo } = context.params;
        const { novoCodigo } = await request.json();
        
        const turma = await Turma.findOne({ codigo });

        if (!turma) {
            return NextResponse.json({
                mensagem: "Turma não encontrada."
            }, {
                status: 404
            });
        }

        turma.codigo = novoCodigo;
        await turma.save();

        return NextResponse.json({
            mensagem: "Código da turma atualizado com sucesso.",
            turma
        });
    } catch (error) {
        return NextResponse.json({
            mensagem: "Requisição incorreta.",
            error: error
        }, {
            status: 400
        });
    }
}

// deletar turma
export async function DELETE(request: Request, context: any) {
    await dbConnect();

    try {
        const { codigo } = context.params;
        
        const turmaRemovida = await Turma.findOneAndDelete({ codigo });

        if (!turmaRemovida) {
            return NextResponse.json({
                mensagem: "Turma não encontrada."
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            mensagem: "Turma removida com sucesso."
        });
    } catch (error) {
        return NextResponse.json({
            mensagem: "Requisição incorreta.",
            error: error
        }, {
            status: 400
        });
    }
}
*/