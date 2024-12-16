import dbConnect from "@/app/db/dbConnect";
import Locker, { ILocker } from "@/app/models/Locker";
import { NextResponse } from "next/server";
import { z } from "zod";

// unoccupy locker
export async function POST(request: Request) : Promise<NextResponse>{

    await dbConnect();

    const vacateSchema = z.object({
        locker_id : z.string(),
        reason: z.string()
    })

    try {
        const { locker_id, reason } = vacateSchema.parse(await request.json());
        
        // checks if the locker isn't aldeary unoccupy
        const locker =  <ILocker> await Locker.findById(locker_id);

        if(!locker){
            return NextResponse.json(
                { message: "Armário não encontrado." },
                { status: 404 }
            )
        }

        if(!locker.occupied){
            return NextResponse.json(
                { message: "Este armário já está desocupado." },
                { status: 400 }
            );
        }

        if(locker.start_date && locker.end_date){
            locker.history.push({
                start_date: new Date(locker.start_date),
                end_date: new Date(locker.end_date),
                reason: reason
            });
        }

        locker.occupied = false;
        locker.start_date = undefined;
        locker.end_date = undefined;
        locker.student_id = undefined;
        
        await Locker.updateOne({_id: locker_id}, locker);
        await Locker.updateOne(
            {_id: locker_id}, 
            {$unset: { start_date: "", end_date: "", student_id: "" }}
        );
        return NextResponse.json(
            { message: "Armário desocupado com sucesso.", locker },
            { status: 200 }
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
        return NextResponse.json(
            { message: "Erro ao desocupar armário. Tente novamente mais tarde." },
            { status: 500 }
        )
    }

}