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
                { status: 400 }
            )
        }

        if(!locker.occupied){
            return NextResponse.json(
                { message: "Este armário já está desocupado." },
                { status: 404 }
            );
        }

        locker.history.push({
            start_date: new Date(locker.start_date),
            end_date: new Date(locker.end_date),
            reason: reason
        });

        locker.occupied = false;
        locker.student_id = undefined;
        locker.start_date = undefined;
        locker.end_date = undefined;
        

        await Armario.updateOne(
            {_id: body.armario_id}, 
            novoArmario, 
        );
        await Armario.updateOne(
            {_id: body.armario_id}, 
            {$unset: { data_ocupacao: "", data_prazo: "", aluno_id: "" }}
        );
        const armarioAtualizado = await Armario.findById(body.armario_id);
        return NextResponse.json(armarioAtualizado);
    } 
    catch (error) {

        if(error instanceof z.ZodError){
            return NextResponse.json(
                { message: "Erro de requisição.", errors: error.issues },
                { status: 400 }
            )
        }

        console.log(error);
        return NextResponse.json(
            { message: "Erro ao desocupar armário. Tente novamente mais tarde." },
            { status: 500 }
        )
    }

}