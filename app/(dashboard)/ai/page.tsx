"use client";

import { AIConsultant } from "@/components/ai/ai-consultant";

export default function AIPage() {
    return (
        <div className="h-[80vh] animate-fade-in flex justify-center">
            <div className="w-full max-w-3xl h-full glass rounded-2xl overflow-hidden relative border border-white/20">
                <AIConsultant embedded={true} />
            </div>
        </div>
    );
}
