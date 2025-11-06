/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ListFilter, Send } from "lucide-react";

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
  const boundsRef = useRef<HTMLDivElement>(null);

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
      "Do not use tables in your response. Present structured information as concise bullet lists with short headings or 'Label: detail' lines. Keep layout mobile-friendly and readable.",
      "When responding, consider the recent intents and avoid repeating prior advice. If a plan already exists, build on it with next steps or deeper guidance.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [field, visibleMessages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Do NOT show category prefix in the visible user's message.
    const userVisible = trimmed;
    const userMsg: Message = { role: "user", content: userVisible };
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
          system: dynamicSystem, // includes the category context
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  }

  return (
    <div ref={boundsRef} className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="panel"
              drag
              dragMomentum
              dragElastic={0.12}
              dragConstraints={boundsRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative w-[min(92vw,420px)] max-h-[70vh] rounded-2xl border shadow-2xl backdrop-blur-xl",
                "flex flex-col",
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
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">AI Consultant</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15">
                    {field}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)}>
                    ✕
                  </Button>
                </div>
              </div>

              <div className="relative flex-1 overflow-y-auto overscroll-contain p-3 space-y-3">
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
                <div className="flex items-end gap-2">
                  <CategoryPicker field={field} setField={setField} />
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask about ${field.toLowerCase()}...`}
                    disabled={loading}
                    rows={2}
                    className="min-h-[44px] max-h-[120px] flex-1 resize-y bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm placeholder:text-foreground/50"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="shadow-md"
                    size="icon"
                    aria-label="Send"
                    title="Send"
                  >
                    <Send className="size-4" />
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
              drag
              dragMomentum
              dragElastic={0.12}
              dragConstraints={boundsRef}
            >
              <Button
                size="lg"
                onClick={() => setOpen(true)}
                className={cn(
                  "shadow-lg rounded-2xl px-5 gap-2",
                  "bg-primary text-primary-foreground hover:bg-primary/90 border border-black/10"
                )}
              >
                <span aria-hidden>💬</span>
                Ask AI Consultant
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  const cleaned = isUser ? content : content.replace(/<br\s*\/?>/gi, "\n");
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-xl border shadow-md",
          isUser
            ? "bg-primary/90 text-primary-foreground border-white/20 px-3 py-2"
            : "bg-white/5 backdrop-blur border-white/10"
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words text-sm">{cleaned}</div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-base font-semibold mt-2 mb-1" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-base font-semibold mt-2 mb-1" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-2 mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="text-sm leading-6 my-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="my-2 list-disc pl-5 space-y-1 marker:text-primary/80" {...props} />,
                ol: ({ node, ...props }) => <ol className="my-2 list-decimal pl-5 space-y-1 marker:text-primary/80" {...props} />,
                li: ({ node, ...props }) => <li className="text-sm leading-6" {...props} />,
                hr: () => <hr className="my-3 border-white/10" />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-white/20 pl-3 my-2 italic text-sm text-foreground/80" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="my-3 overflow-hidden rounded-md border border-white/10">
                    <table className="w-full text-sm" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
                th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-medium" {...props} />,
                td: ({ node, ...props }) => <td className="px-3 py-2 align-top border-t border-white/10" {...props} />,
                code: (props) => {
                  const anyProps = props as unknown as { inline?: boolean; className?: string; children?: React.ReactNode };
                  const isInline = Boolean(anyProps.inline);
                  const children = anyProps.children;
                  const rest = props as React.HTMLAttributes<HTMLElement>;
                  return isInline ? (
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px]" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <pre className="my-2 overflow-x-auto rounded bg-black/60 p-3 text-[12px]">
                      <code {...rest}>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {cleaned}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryPicker({
  field,
  setField,
}: {
  field: string;
  setField: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon-sm" variant="outline" title={`Category: ${field}`} className="shrink-0">
          <ListFilter className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="text-xs mb-2 text-muted-foreground">Focus category</div>
        <div className="grid gap-1">
          {FOCUS_FIELDS.map((f) => (
            <button
              key={f}
              className={cn(
                "w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                f === field && "bg-accent/60"
              )}
              onClick={() => {
                setField(f);
                setOpen(false);
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}