import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Locker from "@/app/models/Locker";

// get lockers from an specific building
export async function GET(
    _request: Request, 
    { params } : { params: Promise<{ building: string }> }
    ) : Promise<NextResponse> {

    await dbConnect();

    try {
        const building = (await params).building;
        if(!['A', 'B', 'C', 'D'].includes(building)){
            return NextResponse.json(
                { message: "Prédio inválido." },
                { status: 400 }
            )
        }
        const lockers = await Locker.find({building: building});
        return NextResponse.json(
            lockers,
            { status: 200 }
        );

    } catch (error) {

        console.error("Erro interno do servidor.", error);
        return NextResponse.json(
            { message: "Erro interno do servidor. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}