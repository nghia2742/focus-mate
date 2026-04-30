"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image as ImageIcon } from "lucide-react";
import { BackgroundSetting } from "../settings/background-setting";

export function PhotosWidget() {
    return (
        <div className="flex flex-col gap-6 h-full p-8 pt-10">
            <DialogHeader className="mb-2">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <ImageIcon className="size-6 text-blue-400" />
                    </div>
                    Background Photos
                </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <BackgroundSetting />
            </div>

        </div>
    );
}
