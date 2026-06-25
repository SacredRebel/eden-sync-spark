import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithAssistant } from "@/lib/submissions.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Send, Sparkles } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/quote/thanks")({
  validateSearch: (s) => z.object({ id: z.string().uuid() }).parse(s),
  head: () => ({ meta: [{ title: "Thanks! | Eden Local Services" }] }),
  component: ThanksPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ThanksPage() {
  const { id } = Route.useSearch();
  const chat = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startChat() {
    setStarted(true);
    setBusy(true);
    try {
      const { reply } = await chat({
        data: {
          submissionId: id,
          userMessage: "Hi! Please review what I sent and share your first thoughts.",
          history: [],
        },
      });
      setMessages([
        { role: "user", content: "Hi! Please review what I sent and share your first thoughts." },
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages([{ role: "assistant", content: err instanceof Error ? err.message : "AI unavailable" }]);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setBusy(true);
    try {
      const { reply } = await chat({
        data: { submissionId: id, userMessage: text, history: messages },
      });
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...history, { role: "assistant", content: err instanceof Error ? err.message : "AI error" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f0e2] text-[#2f2f25]">
      <header className="bg-[#203f24] text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        <div className="rounded-2xl border bg-white p-6 text-center md:p-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#203f24]" />
          <h1 className="mt-4 font-serif text-3xl">Got it — thank you!</h1>
          <p className="mt-2 text-[#2f2f25]/70">
            Sasha will personally review your submission within 24 hours. Meanwhile, our AI design assistant can
            riff with you on ideas and a ballpark range.
          </p>
          {!started && (
            <Button onClick={startChat} className="mt-6 bg-[#203f24] hover:bg-[#17331d]">
              <Sparkles className="mr-2 h-4 w-4" /> Chat with the AI assistant
            </Button>
          )}
        </div>

        {started && (
          <div className="mt-6 rounded-2xl border bg-white">
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                      m.role === "user"
                        ? "bg-[#203f24] text-white"
                        : "bg-[#203f24]/5 text-[#2f2f25]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="text-sm text-[#2f2f25]/50">Thinking…</div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="flex items-end gap-2 border-t p-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your project..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <Button onClick={send} disabled={busy} className="bg-[#203f24] hover:bg-[#17331d]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}