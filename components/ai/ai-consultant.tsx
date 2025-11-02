"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const FOCUS_FIELDS = [
  "Productivity",
  "Time Management",
  "Deep Work",
  "Habits",
  "Wellness",
  "Learning",
];

export function AIConsultant() {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<string>("Productivity");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are Focus Mate, an AI consultant that gives clear, practical, and evidence-based advice about productivity, focus, time management, deep work, habits, wellness, and effective learning. Keep answers concise but actionable. Where helpful, suggest short step-by-step plans.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const fieldPrefix = field ? `[${field}] ` : "";
    const userMsg: Message = { role: "user", content: fieldPrefix + trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({
            role,
            content,
          })),
          // model: "openai/gpt-oss-20b:free", // default set in API route
          temperature: 0.6,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      const content: string =
        data?.content ||
        data?.raw?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (e) {
      toast.error("Consultant error. Check server logs and API key.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="w-[360px] sm:w-[420px] rounded-xl border shadow-2xl bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="p-3 border-b flex items-center justify-between">
              <div className="text-sm font-medium">AI Consultant</div>
              <div className="flex items-center gap-2">
                <FieldSelect field={field} setField={setField} />
                <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)}>
                  ✕
                </Button>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-3 space-y-3">
              {visibleMessages.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  Ask anything about focus fields like productivity, time management, deep work, habits, wellness, or learning.
                </div>
              )}
              {visibleMessages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${field.toLowerCase()}...`}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
          >
            <Button size="lg" onClick={() => setOpen(true)} className="shadow-lg">
              Ask AI Consultant
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        )}
      >
        {content}
      </div>
    </div>
  );
}

function FieldSelect({
  field,
  setField,
}: {
  field: string;
  setField: (v: string) => void;
}) {
  return (
    <select
      className="h-8 rounded-md border bg-background px-2 text-xs outline-none"
      value={field}
      onChange={(e) => setField(e.target.value)}
    >
      {FOCUS_FIELDS.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
}