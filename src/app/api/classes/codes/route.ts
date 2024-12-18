import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Class from "@/app/models/Class";
import { z } from "zod";

// list classes code
export async function GET() : Promise<NextResponse>{

    await dbConnect();

    try {
        const classes = await Class.find({}, {code: 1, _id: false});
        const codes = classes.map((c) => c.code);
        return NextResponse.json(
            { codes },
            { status: 200 }
        );
    } 
    catch (error) {
        
        console.error(error);
        return NextResponse.json(
            { mensagem: "Erro ao listar turmas. Tente novamente mais tarde." }, 
            { status: 500 }
        );
    }
}