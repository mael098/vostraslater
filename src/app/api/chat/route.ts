export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch(
    "http://localhost:11434/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5-coder:7b",
        messages,
        stream: true,
      }),
    }
  );

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

// export async function POST(req: Request) {
//   const { prompt } = await req.json();

//   const ollamaResponse = await fetch(
//     "http://localhost:11434/api/generate",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "qwen2.5-coder:7b",
//         prompt,
//         stream: true,
//       }),
//     }
//   );

//   if (!ollamaResponse.ok) {
//     return new Response(
//       JSON.stringify({
//         error: "Error al conectar con Ollama",
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }

//   return new Response(ollamaResponse.body, {
//     headers: {
//       "Content-Type": "text/plain; charset=utf-8",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }