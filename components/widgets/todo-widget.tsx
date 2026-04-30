"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Circle, Plus, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export function TodoWidget() {
    const [input, setInput] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const supabase = createClient();
    const queryClient = useQueryClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsAuthLoading(false);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsAuthLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Fetch Todos Query
    const { data: todos = [], isLoading: isTodosLoading } = useQuery<Todo[]>({
        queryKey: ["todos", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    // Add Todo Mutation
    const addMutation = useMutation({
        mutationFn: async (title: string) => {
            if (!user) throw new Error("Not authenticated");
            const { data, error } = await supabase
                .from("todos")
                .insert([{ title, is_completed: false, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
            setInput("");
        },
        onError: (error: Error) => {
            toast.error("Failed to add task: " + error.message);
        },
    });

    // Toggle Todo Mutation
    const toggleMutation = useMutation({
        mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
            const { error } = await supabase
                .from("todos")
                .update({ is_completed })
                .eq("id", id);

            if (error) throw error;
        },
        onMutate: async ({ id, is_completed }) => {
            await queryClient.cancelQueries({ queryKey: ["todos", user?.id] });
            const previousTodos = queryClient.getQueryData<Todo[]>(["todos", user?.id]);

            queryClient.setQueryData<Todo[]>(["todos", user?.id], (old) =>
                old?.map((t) => (t.id === id ? { ...t, is_completed } : t))
            );

            return { previousTodos };
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["todos", user?.id], context.previousTodos);
            }
            toast.error("Failed to update task");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
        },
    });

    // Delete Todo Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("todos")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["todos", user?.id] });
            const previousTodos = queryClient.getQueryData<Todo[]>(["todos", user?.id]);

            queryClient.setQueryData<Todo[]>(["todos", user?.id], (old) =>
                old?.filter((t) => t.id !== id)
            );

            return { previousTodos };
        },
        onError: (err, id, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["todos", user?.id], context.previousTodos);
            }
            toast.error("Failed to delete task");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
        },
    });

    const handleAddTodo = () => {
        const text = input.trim();
        if (text) {
            addMutation.mutate(text);
        }
    };

    if (!user && !isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
                <CheckCircle2 className="size-12 text-white/20" />
                <div className="space-y-1">
                    <p className="glass-text font-medium text-lg">Sign in to sync tasks</p>
                    <p className="glass-text-faint text-sm">Your focus tasks will be saved and synced across devices.</p>
                </div>
            </div>
        );
    }

    const isLoading = isAuthLoading || isTodosLoading;

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
                    className="flex-1 px-4 py-2.5 rounded-xl glass glass-text text-sm placeholder:glass-text-faint focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                    placeholder="Add a task…" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddTodo()}
                    disabled={isLoading || addMutation.isPending}
                />
                <button 
                    onClick={handleAddTodo} 
                    disabled={isLoading || !input.trim() || addMutation.isPending}
                    className="px-4 py-2.5 rounded-xl glass hover-glass glass-text transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                    aria-label="Add"
                >
                    {addMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-3">
                        <Loader2 className="size-6 text-white/20 animate-spin" />
                        <p className="text-xs glass-text-faint">Loading your tasks...</p>
                    </div>
                ) : todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-40">
                        <p className="text-sm glass-text">No tasks yet</p>
                        <p className="text-xs glass-text-faint">Start by adding one above</p>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {todos.map(t => (
                            <li 
                                key={t.id} 
                                className="group flex items-center gap-3 px-4 py-4 rounded-xl glass-panel-subtle hover:glass-panel transition-all cursor-pointer" 
                                onClick={() => toggleMutation.mutate({ id: t.id, is_completed: !t.is_completed })}
                            >
                                {t.is_completed ? <CheckCircle2 className="size-5 text-emerald-400 shrink-0" /> : <Circle className="size-5 glass-text-faint shrink-0" />}
                                <span className={cn("flex-1 text-sm font-medium", t.is_completed ? "line-through glass-text-faint" : "glass-text")}>{t.title}</span>
                                <button 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity glass-text-faint hover:text-red-400 p-1" 
                                    onClick={e => { e.stopPropagation(); deleteMutation.mutate(t.id); }}
                                    disabled={deleteMutation.isPending}
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {!isLoading && todos.length > 0 && (
                <p className="text-xs glass-text-faint text-right mt-2">
                    {todos.filter(t => t.is_completed).length}/{todos.length} done
                </p>
            )}
        </div>
    );
}
