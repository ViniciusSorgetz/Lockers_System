import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Locker from "@/app/models/Locker";
import { z } from "zod";


// get lockers from an specific building
export async function GET(
    _request: Request, 
    { params } : { params: Promise<{ building: string }> }
    ) : Promise<NextResponse> {

    await dbConnect();
    const buildingSchema = z.enum(['A', 'B', 'C', 'D']);
    
    try {
        const building = buildingSchema.parse((await params).building);
        const lockers = await Locker.find({building: building});
        return NextResponse.json(
            lockers,
            { status: 200 }
        );

    } catch (error) {

        if(error instanceof z.ZodError) return NextResponse.json(
            { message: "Erro de requisição.", errors: error.issues },
            { status: 400 }
        );

        console.error("Erro interno do servidor.", error);
        return NextResponse.json(
            { message: "Erro interno do servidor. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}