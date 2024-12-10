import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Turma from "@/app/models/Turma";

// listar turmas
export async function GET(){

    await dbConnect();

    try {
        const turmas = await Turma.find({});
        return NextResponse.json(turmas);
    } 
    catch (error) {
        return NextResponse.json({
            mensagem: "Erro ao listar turmas. Tente novamente mais tarde."
        }, {
            status: 500
        });
    }
}

// adicionar aluno
export async function POST(request: Request){

    await dbConnect();

    try {
        const turma = await request.json();
        
        // verifica se a turma já existe
        const verificaTurma = await Turma.findOne({codigo: turma.codigo});
        if(verificaTurma){
            return NextResponse.json({
                message: "Esta turma já existe.",
            }, {
                status: 400
            })
        }

        await Turma.create(turma);
        const turmaCriada = await Turma.findOne({codigo: turma.codigo});
        return NextResponse.json(turmaCriada);
    } 
    catch (error) {
        return NextResponse.json({
            message: "Requisição incorreta.",
            error: error
        }, {
            status: 400
        });
    }
}
