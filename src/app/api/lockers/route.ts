import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Locker from "@/app/models/Locker";

// Adicionar armário
export async function POST(request: Request) {

    await dbConnect();

    try {
        const { building, number} = await request.json();

        // Checks if the locker doesn't already exist
        const locker = await Locker.findOne({building, number});

        if (locker) {
            return NextResponse.json(
                { message: "Este armário já existe." },
                { status: 400 }
            );
        }

        // Adds a new locker
        const createdLocker = await Locker.create({building, number});
        return NextResponse.json(
            createdLocker,
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro ao adicionar armário:", error);
        return NextResponse.json(
            { mensagem: "Requisição incorreta." },
            { status: 400 }
        );
    }
}

// Remover armário
export async function DELETE(request: Request) {
    try {
        const { building, number } = await request.json();

        const removedLocker = await Locker.findOneAndDelete({building, number});

        if (!removedLocker) {
            return NextResponse.json(
                { mensagem: "Armário não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { mensagem: "Armário removido com sucesso." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro ao remover armário:", error);
        return NextResponse.json(
            { mensagem: "Erro ao remover armário." },
            { status: 500 }
        );
    }
}
