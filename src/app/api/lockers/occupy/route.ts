import dbConnect from "@/app/db/dbConnect";
import Class from "@/app/models/Class";
import Locker, { ILocker } from "@/app/models/Locker";
import { objectIdSchema } from "@/app/schemas/schemas";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

// occupy locker
export async function POST(request: Request) : Promise<NextResponse>{

    await dbConnect();

    const occupySchema = z.object({
        deadline : z.string().datetime({local: true}),
        student_id : objectIdSchema,
        locker_id : objectIdSchema
    })

    try {
        const { deadline, student_id, locker_id } = occupySchema.parse(await request.json());

        // checks if a locker isn't already occupied
        const locker = <ILocker> await Locker.findById(locker_id);
        if(!locker) return NextResponse.json(
            { message: "Armário não encontrado." },
            { status: 404 }
        )
        if(locker.occupied) return NextResponse.json(
                { message: "Este armário já está ocupado." }, 
                { status: 400 }
        );
        // checks if the student exists
        const studentClass = await Class.findOne({"students._id" : student_id});
        if(!studentClass) return NextResponse.json(
            { message: "Estudante não encontrado." },
            { status: 404 }
        );
        
        locker.occupied = true;
        locker.student_id = new mongoose.Types.ObjectId(student_id);
        locker.start_date = new Date(Date.now());
        locker.end_date = new Date(deadline);

        await Locker.updateOne({_id: locker_id}, locker);
        return NextResponse.json(
            { message: "Armário ocupado com sucesso.", locker: locker},
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
            { message: "Erro ao ocupar armário. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}