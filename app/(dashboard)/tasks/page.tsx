"use client";

import { TodoList } from "@/components/tools/todo-list";

export default function TasksPage() {
    return (
        <div className="h-[80vh] max-w-3xl mx-auto animate-fade-in">
            <TodoList />
        </div>
    );
}
