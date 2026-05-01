"use client";

import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit3 } from "lucide-react";

export function NotesWidget() {
    const [value, setValue] = useState("Ideas for Focus Mate:\n- Add more soundscapes\n- Integrate Spotify API\n- Mobile app version");
    return (
        <div className="h-full flex flex-col p-8 pt-10">
            <DialogHeader className="mb-6">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                    <Edit3 className="size-6 text-amber-400" />
                    Scratchpad
                </DialogTitle>
            </DialogHeader>
            <textarea
                className="w-full flex-1 bg-transparent resize-none outline-none glass-text font-mono text-sm leading-relaxed placeholder:glass-text-faint"
                placeholder="Write anything…" value={value} onChange={e => setValue(e.target.value)}
            />
        </div>
    );
}
