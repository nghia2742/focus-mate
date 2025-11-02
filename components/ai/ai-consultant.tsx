"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type AssistantOrUserMessage = { role: "user" | "assistant"; content: string };

const FOCUS_FIELDS = [
  "Productivity",
  "Time Management",
  "Deep Work",
  "Habits",
  "Wellness",
  "Learning",
];

const BASE_SYSTEM =
  "You are Focus Mate, an AI consultant that gives clear, practical, and evidence-based advice about productivity, focus, time management, deep work, habits, wellness, and effective learning. Keep answers concise but actionable. Where helpful, suggest short step-by-step plans.";

export function AIConsultant() {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<string>("Productivity");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: BASE_SYSTEM,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const visibleMessages: AssistantOrUserMessage[] = useMemo(
    () =>
      messages.filter(
        (m): m is AssistantOrUserMessage => m.role === "user" || m.role === "assistant"
      ),
    [messages]
  );

  // Build a dynamic system prompt that carries session context.
  const dynamicSystem = useMemo(() => {
    const lastUsers = visibleMessages
      .filter((m) => m.role === "user")
      .slice(-3)
      .map((m) => `- ${m.content}`)
      .join("\n");
    const lastAssistant = visibleMessages
      .filter((m) => m.role === "assistant")
      .slice(-3)
      .map((m) => `- ${m.content.substring(0, 200)}${m.content.length > 200 ? "..." : ""}`)
      .join("\n");

    return [
      BASE_SYSTEM,
      `Focus field: ${field}.`,
      lastUsers ? `Recent user intents:\n${lastUsers}` : "",
      lastAssistant ? `Your recent advice (truncated):\n${lastAssistant}` : "",
      "When responding, consider the recent intents and avoid repeating prior advice. If a plan already exists, build on it with next steps or deeper guidance.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [field, visibleMessages]);

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
          // Send only non-system messages; system will be injected via `system`
          messages: [...messages, userMsg]
            .filter((m) => m.role !== "system")
            .map(({ role, content }) => ({ role, content })),
          system: dynamicSystem,
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
    } catch (err) {
      console.error(err);
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
            className={cn(
              "relative w-[360px] sm:w-[420px] max-h-[70vh] rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden",
              "flex flex-col",
              // Glass liquid style: subtle gradient border and translucent inner
              "border-white/15 bg-white/8 dark:bg-white/5"
            )}
          >
            {/* Animated liquid blobs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 -right-10 size-56 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-2xl animate-[float_12s_ease-in-out_infinite]" />
              <div className="absolute -bottom-20 -left-10 size-64 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-400/20 blur-3xl animate-[float_14s_ease-in-out_infinite_reverse]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            <div className="relative p-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/10 to-transparent">
              <div className="text-sm font-medium">AI Consultant</div>
              <div className="flex items-center gap-2">
                <FieldSelect field={field} setField={setField} />
                <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)}>
                  ✕
                </Button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 [scrollbar-width:thin] [scrollbar-color:theme(colors.primary)_transparent]">
              {visibleMessages.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  Ask anything about focus fields like productivity, time management, deep work, habits, wellness, or learning.
                </div>
              )}
              {visibleMessages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
                  Thinking...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="relative p-3 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${field.toLowerCase()}...`}
                  disabled={loading}
                  className="bg-white/10 border-white/20 placeholder:text-foreground/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="shadow-md"
                >
                  {loading ? "..." : "Send"}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
          >
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className={cn(
                "shadow-lg rounded-2xl px-5",
                "backdrop-blur-lg border border-white/20 bg-white/10"
              )}
            >
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
          "max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words border",
          isUser
            ? "bg-primary/90 text-primary-foreground border-white/20 shadow-md"
            : "bg-white/10 backdrop-blur border-white/15 shadow-md"
        )}
      >
        {isUser ? (
          content
        ) : (
          <div className="prose prose-invert prose-sm max-w-none [&>p]:my-2 [&_code]:bg-background/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
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
      className="h-8 rounded-md border bg-white/10 backdrop-blur px-2 text-xs outline-none border-white/20"
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