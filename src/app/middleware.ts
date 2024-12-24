import { NextResponse } from "next/server"

export async function middleware(request: Request) : Promise<NextResponse>{
    const oi = request.headers;
    console.log(oi);
    return NextResponse.json(
        { oi },
        { status: 200 }
    )
}

export const config = {
    matcher: ['/armarios', '/turmas']
}