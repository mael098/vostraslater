import { NextResponse } from 'next/server'


export async function POST(req: Request) {
    const { prompt } = await req.json()
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gemma3:latest",
            prompt,
            stream: false,
        }),
    });
    
    const data = await response.json()

    return NextResponse.json(data)
    
}