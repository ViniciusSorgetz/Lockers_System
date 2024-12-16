import Locker from "@/app/models/Locker";
import { NextResponse } from "next/server";
import { z } from "zod";

//get information from an specific locker  
//Dynamic Routes
export async function GET(
    _request: Request, 
    { params, } : {params: Promise<{ locker_id: string }>}
    ) : Promise<NextResponse> {

    try {
        const lockerIdSchema = z.string().regex(/^[0-9a-f]{24}$/);
        const locker_id = lockerIdSchema.parse((await params).locker_id);
        const locker = await Locker.findById(locker_id);

        if (!locker){
            return NextResponse.json(
                { message: "Armário não encontrado." },
                { status: 404 }
            )
        }

        return NextResponse.json(locker);
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
            { message: "Erro ao obter informações do armário. Tente novamente mais tarde." },
            { status: 500 }
        )
    }
}