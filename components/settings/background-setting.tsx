"use client"

import { useQuery } from "@tanstack/react-query"

export function BackgroundSetting() {
    const { data: backgrounds = [], isLoading } = useQuery({
        queryKey: ['backgrounds'],
        queryFn: async () => {
            const response = await fetch('/api/backgrounds')
            if (!response.ok) throw new Error('Failed to fetch')
            const data = await response.json()
            return data as string[]
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours (Cache-first behavior)
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    if (isLoading) {
        return (
            <div className="space-y-4 py-4">
                <h4 className="text-sm font-medium">Background Image</h4>
                <div className="grid grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-video bg-white/5 rounded-md" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 py-4">
            <h4 className="text-sm font-medium">Background Image</h4>
            <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
                {backgrounds.map((bg) => (
                    <div
                        key={bg}
                        className="cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-primary active:scale-95 transition-all"
                        onClick={() => {
                            localStorage.setItem('settings-background', `/backgrounds/${bg}`);
                            window.dispatchEvent(new Event('background-updated'));
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/backgrounds/${bg}`} alt={bg} className="object-cover aspect-video" />
                    </div>
                ))}
            </div>
        </div>
    )
}
