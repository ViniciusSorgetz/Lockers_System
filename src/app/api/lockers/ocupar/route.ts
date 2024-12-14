import dbConnect from "@/app/db/dbConnect";
import Armario from "@/app/models/Locker";
import { NextResponse } from "next/server";

export async function POST(request: Request) : Promise<Response>{

    await dbConnect();

    try {
        const body = await request.json();
        
        // verifica se o armario já não está ocupado
        const armario = await Armario.findById(body.armario_id);
        if(armario.ocupado){
            return NextResponse.json({
                message: "Este armário já está ocupado."
            }, {
                status: 400
            });
        }
        // verifica se o id do aluno foi enviado junto no body
        if(!body.aluno_id){
            return NextResponse.json({
                mensagem: "Necessário informar o id do aluno."
            }, {
                status: 400
            });
        }
        if(!body.prazo){
            return NextResponse.json({
                mensagem: "Necessário informar o prazo da ocupação do armário."
            }, {
                status: 400
            });
        }
        // convertendo objeto mongoose em objeto javascript
        const armarioObj = armario.toObject();
        const novoArmario = {
            ...armarioObj,
            ocupado: true,
            aluno_id: body.aluno_id,
            data_ocupacao: Date.now(),
            data_prazo: body.prazo
        }
        await Armario.updateOne({_id: body.armario_id}, novoArmario);
        const armarioAtualizado = await Armario.findById(body.armario_id);
        return NextResponse.json(armarioAtualizado);
    } 
    catch (error) {
        console.log(error);
        return NextResponse.json({
            mensagem: "Requisição incorreta."
        })
    }

}