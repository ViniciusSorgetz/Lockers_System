import Locker from "@/app/models/Locker";
import { NextResponse } from "next/server";

//get information from an specific locker  
//Dynamic Routes
export async function GET(
    _request: Request, 
    { params, } : {params: Promise<{ locker_id: string }>}
    ) : Promise<NextResponse> {

    try {
        const locker_id = (await params).locker_id;
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
        console.log(error);
        return NextResponse.json(
            { message: "Erro ao obter informações do armário. Tente novamente mais tarde." },
            { status: 500 }
        )
    }
}