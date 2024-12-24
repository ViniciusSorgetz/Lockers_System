import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Class, { Student } from "@/app/models/Class";
import { z } from "zod";

const codeSchema = z.string().trim().min(2);

// get class information
export async function GET(
    _request: Request, 
    { params } : { params: Promise<{ code:string }> } 
) : Promise<NextResponse>{

    await dbConnect();

    try {
        const code = codeSchema.parse((await (params)).code);
        const codeClass = await Class.findOne({code: code});

        if(!codeClass) return NextResponse.json(
            { message: "Sala não encontrada." },
            { status: 404 }
        )

        return NextResponse.json(
            { codeClass },
            { status: 200 }
        );
        
    } 
    catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao buscar informações da sala. Tente novamente mais tarde." }, 
            { status: 500 }
        );
    }
}

// adds a student to a class
export async function POST(
    request: Request, 
    { params } : { params: Promise<{ code:string }> } 
) : Promise<NextResponse>{

    await dbConnect();
    const studentSchema = z.object({
        name: z.string().trim().min(1),
        phone_number: z.string().trim().min(9).optional().or(z.literal(''))
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
        const updatedStudent = <Student | undefined> studentClass.students.find((s : Student) => 
            s.name == student.name);

        return NextResponse.json(
            { message: "Aluno adicionado com sucesso.", student: updatedStudent },
            { status: 201 }
        );
    } 
    catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao adicionar aluno na sala. Tente novamente mais tarde." }, 
            { status: 500 }
        );
    }
}

// edit class code
export async function PATCH(
    request: Request,
    { params } : { params : Promise<{ code : string }>}
    ) : Promise<NextResponse> 
    {
    await dbConnect();
    const newCodeSchema = z.object({
        newCode : codeSchema
    })

    try {
        const code = codeSchema.parse((await(params)).code);
        const { newCode } = newCodeSchema.parse(await request.json());
        
        const codeClass = await Class.findOne({code: code});

        if (!codeClass) {
            return NextResponse.json(
                { mensagem: "Turma não encontrada." }, 
                { status: 404 });
        }

        codeClass.code = newCode;
        await codeClass.save();

        return NextResponse.json(
            { message: "Código da turma atualizado com sucesso." },
            { status: 200 }
        );
    } catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
                { message: "Erro de requisição.", errors: error.issues },
                { status: 400 }
        )

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao editar código da turma. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}

// delete class
export async function DELETE(
    _request: Request, 
    { params } : { params: Promise<{code : string}> }
    ) : Promise<NextResponse> {

    await dbConnect();

    try {
        const code = codeSchema.parse((await(params)).code);
        const removedClass = await Class.findOneAndDelete({ code: code });

        if (!removedClass) return NextResponse.json(
            { message: "Turma não encontrada." }, 
            { status: 404 }
        );

        return NextResponse.json(
            { message: "Turma removida com sucesso." },
            { status: 200 }
        );

    } catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { mensagem: "Erro ao deletar turma. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}