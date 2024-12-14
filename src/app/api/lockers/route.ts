import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Locker from "@/app/models/Locker";
import { z } from "zod";

const lockerSchema = z.object ({
    building : z.enum(['A', 'B', 'C', 'D'], { message: "Necessário informar o prédio." }),
    number : z.number({message: "Necessário informar o número do armário."})
        .min(1, {message: "O número do armário deve ser maior que zero."})
        .int({message: "O número do armário deve ser inteiro."})
    
});

// add locker
export async function POST(request: Request) : Promise<NextResponse>{

    await dbConnect();

    try {

        const {building, number} = lockerSchema.parse(await request.json())

        // checks if the locker doesn't already exist
        const locker = await Locker.findOne({building, number});

        if (locker) {
            return NextResponse.json(
                { message: "Este armário já existe." },
                { status: 400 }
            );
        }

        // adds a new locker
        const createdLocker = await Locker.create({building, number});
        return NextResponse.json(
            createdLocker,
            { status: 201 }
        );

    }
    catch (error) {

        if(error instanceof z.ZodError){

            return NextResponse.json(
                { message: "Erro de requisição.", errors:  error.issues},
                { status: 400}
            )
        }

        console.error("Erro interno do servidor", error);
        return NextResponse.json(
            { message: "Erro interno do servidor. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}

// remove locker
export async function DELETE(request: Request) : Promise<NextResponse>{

    try {

        const { building, number } = lockerSchema.parse(await request.json());

        const removedLocker = await Locker.findOneAndDelete({building, number});

        if (!removedLocker) {
            return NextResponse.json(
                { mensagem: "Armário não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Armário removido com sucesso." },
            { status: 200 }
        );

    } catch (error) {

        if(error instanceof z.ZodError){
            return NextResponse.json(
                { message: "Erro de requisição.", errors: error.issues },
                { status: 400 }
            );
        }

        console.error("Erro interno do servidor.", error);
        
        return NextResponse.json(
            { message: "Erro interno do servidor. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}
