"use client"

import { useEffect, useState } from "react"

export function BackgroundSettingClient() {
    const [backgrounds, setBackgrounds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBackgrounds = async () => {
            try {
                const response = await fetch('/api/backgrounds')
                const data = await response.json()
                if (Array.isArray(data)) {
                    setBackgrounds(data)
                }
            } catch (error) {
                console.error("Failed to fetch backgrounds:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBackgrounds()
    }, [])

    if (loading) {
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
