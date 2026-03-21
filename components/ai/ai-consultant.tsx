"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIConsultantProps {
  embedded?: boolean;
}

export function AIConsultant({ embedded = false }: AIConsultantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Focus Consultant. How can I help you plan your day?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`, // Using client-side for demo, simpler than proxy
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-pro-exp-02-05:free",
          messages: [
            { role: "system", content: "You are a helpful productivity assistant. Keep answers concise and motivating." },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ]
        })
      });

      const data = await response.json();
      const aiMsg = data.choices?.[0]?.message?.content || "Sorry, I couldn't connect.";

      setMessages(prev => [...prev, { role: "assistant", content: aiMsg }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col bg-transparent">
        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2 mb-4", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", m.role === "assistant" ? "bg-blue-500/20" : "bg-purple-500/20")}>
                {m.role === "assistant" ? <Bot className="h-4 w-4 text-blue-300" /> : <User className="h-4 w-4 text-purple-300" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm max-w-[80%]",
                m.role === "assistant" ? "bg-white/10 text-white rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"
              )}>
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-blue-300" />
              </div>
              <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-white/50" />
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a plan..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
          />
          <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-500">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-80 md:w-96 h-[500px] glass-heavy rounded-2xl shadow-2xl flex flex-col z-50 border border-white/20 overflow-hidden animate-slide-down">
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          <span className="font-semibold text-white">Focus AI</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-white/50 hover:text-white">
          <span className="sr-only">Close</span>
          ✕
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2 mb-4", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", m.role === "assistant" ? "bg-blue-500/20" : "bg-purple-500/20")}>
              {m.role === "assistant" ? <Bot className="h-4 w-4 text-blue-300" /> : <User className="h-4 w-4 text-purple-300" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm max-w-[80%]",
              m.role === "assistant" ? "bg-white/10 text-white rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"
            )}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-blue-300" />
            </div>
            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-white/50" />
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a plan..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500"
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-500">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}