import Armario from "@/app/models/Locker";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any){

    try {
        const { params } = context;
        const armario = await Armario.findById(params.armario_id);
        return NextResponse.json(armario);
    } 
    catch (error) {
        console.log(error);
        return NextResponse.json({
            mensagem: "Erro ao obter informações do armário. Tente novamente mais tarde."
        })
    }

}