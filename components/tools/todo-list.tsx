
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

export function TodoList() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Task));
            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !user) return;

        await addDoc(collection(db, "tasks"), {
            userId: user.uid,
            title: newTask,
            completed: false,
            createdAt: serverTimestamp(),
        });
        setNewTask("");
    };

    const toggleComplete = async (task: Task) => {
        await updateDoc(doc(db, "tasks", task.id), {
            completed: !task.completed
        });
    };

    const handleDelete = async (taskId: string) => {
        if (confirm("Delete this task?")) {
            await deleteDoc(doc(db, "tasks", taskId));
        }
    };

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    if (!user) return <div className="glass p-4 rounded-xl text-center text-white/50">Sign in to use Todos</div>;

    return (
        <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-white/10 shrink-0">
                <h3 className="text-lg font-semibold text-white mb-4">Todo List</h3>
                <form onSubmit={handleAddTask} className="flex gap-2">
                    <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="glass bg-transparent border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button type="submit" size="icon" className="glass hover:bg-white/10">
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                {/* Pending Tasks */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Pending - {pendingTasks.length}</h4>
                    {pendingTasks.map((task) => (
                        <div key={task.id} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => toggleComplete(task)}
                                    className="border-white/50 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                                <span className="text-white truncate">{task.title}</span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(task.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {pendingTasks.length === 0 && (
                        <div className="text-center text-white/20 text-sm py-4 italic">No pending tasks</div>
                    )}
                </div>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Completed - {completedTasks.length}</h4>
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                        </div>

                        {completedTasks.map((task) => (
                            <div key={task.id} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-60">
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => toggleComplete(task)}
                                        className="border-white/50 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    />
                                    <span className="text-white truncate line-through decoration-white/50">{task.title}</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDelete(task.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
