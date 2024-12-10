import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Locker from "@/app/models/Locker";

// Get lockers
export async function GET(request: Request, context: any) {

    await dbConnect();

    try {
        const { params } = context;
        const lockers = await Locker.find({building: params.building});
        return NextResponse.json(
            lockers,
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro ao listar armários:", error);
        return NextResponse.json(
            { mensagem: "Erro ao listar armários." },
            { status: 400 }
        );
    }
}