"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { AmbientSection } from "./ambient-section";

export function MusicWidget() {
    return (
        <div className="flex flex-col gap-6 h-full p-8 pt-10">
            <DialogHeader className="mb-2">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                    <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
                        <Music className="size-6 text-pink-400" />
                    </div>
                    Focus Sounds
                </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AmbientSection />
            </div>

        </div>
    );
}
