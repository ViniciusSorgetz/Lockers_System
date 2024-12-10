import dbConnect from "@/app/db/dbConnect";
import Armario from "@/app/models/Locker";
import { NextResponse } from "next/server";

// desocupar armário
export async function POST(request: Request){

    await dbConnect();

    try {
        const body = await request.json();
        
        // verifica se o armario já não está ocupado
        const armario = await Armario.findById(body.armario_id);
        if(!armario.ocupado){
            return NextResponse.json({
                message: "Este armário já está desocupado."
            }, {
                status: 400
            });
        }

        // convertendo objeto mongoose em objeto javascript
        const armarioObj = armario.toObject();
        const novoArmario = {
            _id: armario.id,
            predio: armario.predio,
            numero: armario.numero,
            ocupado: false,
            historico: [
                ...armarioObj.historico,
                {
                    inicio: armario.data_ocupacao,
                    termino: Date.now(),
                    prazo: armario.data_prazo,
                    motivo: body.motivo || null,
                    aluno_id: armario.aluno_id
                }
            ],
        }
        await Armario.updateOne(
            {_id: body.armario_id}, 
            novoArmario, 
        );
        await Armario.updateOne(
            {_id: body.armario_id}, 
            {$unset: { data_ocupacao: "", data_prazo: "", aluno_id: "" }}
        );
        const armarioAtualizado = await Armario.findById(body.armario_id);
        return NextResponse.json(armarioAtualizado);
    } 
    catch (error) {
        console.log(error);
        return NextResponse.json({
            mensagem: "Requisição incorreta.",
        })
    }

}