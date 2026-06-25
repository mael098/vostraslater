"use client";

import { useState } from "react";
import { SendHorizontal, Paperclip } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleButton = async () => {
    if (!prompt.trim() || loading) return;

    const currentPrompt = prompt;

    setPrompt("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentPrompt,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No stream disponible");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";
      let buffer = "";
      let firstToken = true;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const json = JSON.parse(line);

            if (json.response) {
              assistantText += json.response;

              if (firstToken) {
                setLoading(false);
                firstToken = false;
              }

              setMessages((prev) => {
                const copy = [...prev];

                copy[copy.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };

                return copy;
              });
            }
          } catch (err) {
            console.error("Error parsing chunk:", err);
          }
        }
      }

      // Procesar último fragmento pendiente
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);

          if (json.response) {
            assistantText += json.response;

            setMessages((prev) => {
              const copy = [...prev];

              copy[copy.length - 1] = {
                role: "assistant",
                content: assistantText,
              };

              return copy;
            });
          }
        } catch {}
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => {
        const copy = [...prev];

        copy[copy.length - 1] = {
          role: "assistant",
          content: "❌ Error al conectar con Ollama",
        };

        return copy;
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAudioUpload = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      console.log("STATUS:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `🎤 ${data.text}`,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error al transcribir audio",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-zinc-900 to-slate-950">
      {/* Fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mt-10 mb-6 text-center">
        <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
          Vostraslater
        </h1>
      </div>

      {/* Chat */}
      <div className="relative z-10 flex flex-col w-full max-w-4xl h-[75vh] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white">
                  ¿Qué quieres crear hoy?
                </h2>
                <p className="text-zinc-400 mt-2">Pregúntame cualquier cosa.</p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-5 py-4 shadow-lg ${
                  message.role === "user"
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white"
                    : "bg-white/10 backdrop-blur-md border border-white/10 text-zinc-100"
                }`}
              >
                {message.role === "assistant" ? (
                  <article className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={message.content} />
                  </article>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl px-5 py-4">
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce delay-100"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleButton();
              }}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500"
            />

            <label
              htmlFor="audio-upload"
              className="flex items-center justify-center h-12 w-12 cursor-pointer rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
            >
              <Paperclip size={18} />
            </label>

            <button
              onClick={handleButton}
              disabled={loading}
              className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white transition hover:scale-105 disabled:opacity-50"
            >
              <SendHorizontal size={20} />
            </button>

            <input
              id="audio-upload"
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setAudioFile(file);
                handleAudioUpload(file);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
