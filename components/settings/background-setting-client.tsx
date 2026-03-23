"use client"

export function BackgroundSettingClient({ backgrounds }: { backgrounds: string[] }) {
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
