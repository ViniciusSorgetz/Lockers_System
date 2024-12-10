import { NextResponse } from "next/server";
import dbConnect from "@/app/db/dbConnect";
import Turma from "@/app/models/Turma";

export async function GET(request: Request, context: any) {
    await dbConnect();

    try {
        const { alunoId } = context.params; // `alunoId` vem do contexto
        const turma = await Turma.findOne({ "alunos._id": alunoId }); // Busca a turma que contém o aluno

        if (!turma) {
            return NextResponse.json(
                { mensagem: "Aluno ou turma não encontrado." },
                { status: 404 }
            );
        }

        const aluno = turma.alunos.find((aluno: any) => aluno._id.toString() === alunoId); // Busca o aluno na lista
        if (!aluno) {
            return NextResponse.json(
                { mensagem: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        // Retorna as informações do aluno e a turma
        return NextResponse.json({
            aluno,
            turma: {
                codigo: turma.codigo, // Retorna apenas o código da turma
            },
        });
    } catch (error) {
        return NextResponse.json(
            { mensagem: "Requisição incorreta." },
            { status: 400 }
        );
    }
}

export async function PUT(request: Request, context: any) {
    await dbConnect();

    try {
        const { alunoId } = context.params; // `alunoId` vem do contexto
        const { nome, telefone } = await request.json();

        const turma = await Turma.findOne({ "alunos._id": alunoId }); // Busca a turma que contém o aluno

        if (!turma) {
            return NextResponse.json(
                { mensagem: "Aluno ou turma não encontrado." },
                { status: 404 }
            );
        }

        const aluno = turma.alunos.find((aluno: any) => aluno._id.toString() === alunoId); // Busca o aluno na lista
        if (!aluno) {
            return NextResponse.json(
                { mensagem: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        // Atualiza os dados do aluno
        aluno.nome = nome || aluno.nome;
        aluno.telefone = telefone || aluno.telefone;

        await turma.save(); // Salva a atualização

        // Retorna as informações atualizadas do aluno e a turma
        return NextResponse.json({
            mensagem: "Informações do aluno atualizadas com sucesso.",
            aluno,
            turma: {
                codigo: turma.codigo, // Retorna apenas o código da turma
            },
        });
    } catch (error) {
        return NextResponse.json(
            { mensagem: "Requisição incorreta." },
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request, context: any) {
    await dbConnect();

    try {
        const { alunoId } = context.params; // `alunoId` vem do contexto
        const { codigo } = await request.json(); // Código da turma enviado no body

        if (!codigo) {
            return NextResponse.json(
                { mensagem: "Código da turma é obrigatório." },
                { status: 400 }
            );
        }

        // Busca a turma pelo código
        const turma = await Turma.findOne({ codigo });

        if (!turma) {
            return NextResponse.json(
                { mensagem: "Turma não encontrada." },
                { status: 404 }
            );
        }

        // Filtra os alunos removendo o aluno com o `alunoId`
        const alunoIndex = turma.alunos.findIndex(
            (aluno: any) => aluno._id.toString() === alunoId
        );

        if (alunoIndex === -1) {
            return NextResponse.json(
                { mensagem: "Aluno não encontrado na turma especificada." },
                { status: 404 }
            );
        }

        // Remove o aluno da lista
        turma.alunos.splice(alunoIndex, 1);

        // Salva as alterações na turma
        await turma.save();

        return NextResponse.json({
            mensagem: "Aluno removido com sucesso.",
            turma: {
                codigo: turma.codigo, // Retorna o código da turma
                alunos: turma.alunos, // Retorna a lista atualizada de alunos
            },
        });
    } catch (error) {
        return NextResponse.json(
            { mensagem: "Erro ao processar a requisição." },
            { status: 500 }
        );
    }
}
