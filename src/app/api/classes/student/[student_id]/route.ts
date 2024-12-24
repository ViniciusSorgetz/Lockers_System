import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Class, { Student } from "@/app/models/Class";
import { z } from "zod";

import { objectIdSchema } from "@/app/schemas/schemas";

// get information of a student
export async function GET(
    _request: Request, 
    { params } : {params: Promise<{ student_id: string }>}
    ) : Promise<NextResponse>
    {

    await dbConnect();

    try {
        const studentId = objectIdSchema.parse((await params).student_id);
        const studentClass = await Class.findOne({ "students._id": studentId });

        if (!studentClass) {
            return NextResponse.json(
                { message: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        const student = <Student | undefined> studentClass.students.find((s : Student) => 
            s._id?.toString() == studentId);
        ;

        return NextResponse.json(
            { student: student, class_code : studentClass.code },
            { status: 200 }
        );

    } catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao buscar informações do aluno. Tente novamente mais tarde." },
            { status: 400 }
        );
    }
}

// edit student information
export async function PATCH(
    request: Request, 
    { params } : { params: Promise<{student_id : string}>}
    ) : Promise<NextResponse>{

    await dbConnect();
    const studentSchema = z.object({
        name: z.string().trim().min(1).optional(),
        phone_number: z.string().trim().min(9).optional()
    });
    
    try {
        const student_id = objectIdSchema.parse((await(params)).student_id) ;
        const { name, phone_number } = studentSchema.parse(await request.json());

        const studentClass = await Class.findOne({ "students._id": student_id });

        if (!studentClass) return NextResponse.json(
                { message: "Aluno não encontrado." },
                { status: 404 }
        );

        const studentIndex = studentClass.students.findIndex((s: Student) => 
            s._id?.toString() == student_id); 

        if (studentIndex == -1) return NextResponse.json(
                { message: "Aluno não encontrado." },
                { status: 404 }
        );

        if(name) studentClass.students[studentIndex].name = name;
        if(phone_number) studentClass.students[studentIndex].phone_number = phone_number;
        await studentClass.save();

        return NextResponse.json(
            { message: "Informações do aluno atualizadas com sucesso." },
            { status: 200 }
        );
    } catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao editar informações do aluno. Tente novamente mais tarde." },
            { status: 400 }
        );
    }
}

// remove student
export async function DELETE(
    _request: Request,
    { params } : { params : Promise<{student_id : string}>}
    ) : Promise<NextResponse> {

    await dbConnect();

    try {
        const student_id = objectIdSchema.parse((await(params)).student_id); 
        const studentClass = await Class.findOne({ "students._id" : student_id });

        if(!studentClass) return NextResponse.json(
            { message: "Aluno não encontrado." },
            { status: 404 }
        );

        const studentIndex = studentClass.students.findIndex(
            (s: Student) => s._id?.toString() === student_id
        );
        if (studentIndex === -1) return NextResponse.json( 
                { message: "Aluno não encontrado." },
                { status: 404 }
        );

        studentClass.students.splice(studentIndex, 1);
        await studentClass.save();

        return NextResponse.json(
            { message: "Aluno removido com sucesso." },
            { status: 200 }
        );
    } catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error(error);
        return NextResponse.json(
            { message: "Erro ao processar a requisição." },
            { status: 500 }
        );
    }
}
