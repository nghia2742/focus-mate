"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

export function TodoWidget() {
    const [todos, setTodos] = useState([
        { id: 1, text: "Finalize UI Architecture", done: true },
        { id: 2, text: "Implement mini-widgets", done: false },
        { id: 3, text: "Review animations", done: false },
        { id: 4, text: "Write unit tests", done: false },
    ]);
    const [input, setInput] = useState("");

    const toggle = (id: number) => setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const remove = (id: number) => setTodos(ts => ts.filter(t => t.id !== id));
    const add = () => {
        const text = input.trim();
        if (!text) return;
        setTodos(ts => [...ts, { id: Date.now(), text, done: false }]);
        setInput("");
    };

    return (
        <div className="flex flex-col gap-3 h-full p-8 pt-10">
            <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold glass-text">
                    <CheckCircle2 className="size-6 text-emerald-400" />
                    Tasks
                </DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
                <input
                    className="flex-1 px-4 py-2.5 rounded-xl glass glass-text text-sm placeholder:glass-text-faint focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="Add a task…" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && add()}
                />
                <button onClick={add} className="px-4 py-2.5 rounded-xl glass hover-glass glass-text transition-all" aria-label="Add">
                    <Plus className="size-4" />
                </button>
            </div>
            <ul className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
                {todos.map(t => (
                    <li key={t.id} className="group flex items-center gap-3 px-4 py-4 rounded-xl glass-panel-subtle hover:glass-panel transition-all cursor-pointer" onClick={() => toggle(t.id)}>
                        {t.done ? <CheckCircle2 className="size-5 text-emerald-400 shrink-0" /> : <Circle className="size-5 glass-text-faint shrink-0" />}
                        <span className={cn("flex-1 text-sm font-medium", t.done ? "line-through glass-text-faint" : "glass-text")}>{t.text}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity glass-text-faint hover:text-red-400" onClick={e => { e.stopPropagation(); remove(t.id); }}>
                            <Trash2 className="size-4" />
                        </button>
                    </li>
                ))}
            </ul>
            <p className="text-xs glass-text-faint text-right mt-2">{todos.filter(t => t.done).length}/{todos.length} done</p>
        </div>
    );
}
