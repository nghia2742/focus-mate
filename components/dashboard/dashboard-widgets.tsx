"use client";

import { SettingsPanels } from "../settings/settings-panels";
import { MacOSDock, type DockApp } from "@/components/ui/mac-os-dock";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CheckCircle2, Circle,
    CloudRain,
    Coffee,
    Edit3,
    Flame,
    Music, Play,
    Plus,
    Settings2,
    SkipBack,
    SkipForward,
    Target,
    Trash2,
    TreePine,
    Volume2, VolumeX,
    Waves,
    Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── Ambient sound engine (singleton audio) ─────────────────── */
type AmbientKey = "none" | "rain" | "fire" | "windy" | "waves" | "forest" | "cafe";

const AMBIENT: Record<AmbientKey, { name: string; icon: React.ElementType; file: string | null; color: string }> = {
    none: { name: "None", icon: VolumeX, file: null, color: "text-slate-400" },
    rain: { name: "Rain", icon: CloudRain, file: "/sounds/background-sounds/rain/rain_1.mp3", color: "text-sky-400" },
    fire: { name: "Fire", icon: Flame, file: "/sounds/background-sounds/fire/fire_1.mp3", color: "text-orange-400" },
    windy: { name: "Wind", icon: Wind, file: "/sounds/background-sounds/windy/windy_1.mp3", color: "text-teal-400" },
    waves: { name: "Waves", icon: Waves, file: null, color: "text-blue-400" },
    forest: { name: "Forest", icon: TreePine, file: null, color: "text-green-400" },
    cafe: { name: "Café", icon: Coffee, file: null, color: "text-amber-400" },
};

function AmbientSection() {
    const [active, setActive] = useState<AmbientKey>("none");
    const [volume, setVolume] = useState(50);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const sound = AMBIENT[active];
        if (!sound.file) {
            audioRef.current?.pause();
            return;
        }
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }
        audioRef.current.src = sound.file;
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(console.error);
    }, [active]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume / 100;
    }, [volume]);

    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest glass-text-faint">Ambient Sounds</p>
            <div className="grid grid-cols-4 gap-2">
                {(Object.keys(AMBIENT) as AmbientKey[]).map((key) => {
                    const s = AMBIENT[key];
                    const Icon = s.icon;
                    const isActive = active === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActive(key)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all text-center",
                                isActive ? "glass border border-white/20" : "hover-glass opacity-60 hover:opacity-100"
                            )}
                            title={s.name}
                        >
                            <Icon className={cn("size-5", isActive ? s.color : "glass-text-muted")} />
                            <span className="text-[10px] glass-text-muted leading-tight">{s.name}</span>
                        </button>
                    );
                })}
            </div>
            {active !== "none" && (
                <div className="flex items-center gap-3 mt-1">
                    <Volume2 className="size-3.5 glass-text-faint shrink-0" />
                    <input
                        type="range" min="0" max="100" value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="flex-1 accent-violet-400 h-1.5 rounded-lg appearance-none cursor-pointer bg-white/20"
                    />
                    <span className="text-xs glass-text-faint w-8 text-right">{volume}%</span>
                </div>
            )}
        </div>
    );
}

/* ─── Widget content components ──────────────────────────────── */

function TodoContent() {
    const [todos, setTodos] = useState([
        { id: 1, text: "Finalize UI Architecture", done: true },
        { id: 2, text: "Implement mini-widgets", done: false },
        { id: 3, text: "Review animations", done: false },
        { id: 4, text: "Write unit tests", done: false },
    ]);
    const [input, setInput] = useState("");

    const toggle = (id: number) => setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const remove = (id: number) => setTodos(ts => ts.filter(t => t.id !== id));
    const add = () => {
        const text = input.trim();
        if (!text) return;
        setTodos(ts => [...ts, { id: Date.now(), text, done: false }]);
        setInput("");
    };

    return (
        <div className="flex flex-col gap-3 h-full p-8 pt-10">
            <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                    <CheckCircle2 className="size-6 text-emerald-400" />
                    Tasks
                </DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
                <input
                    className="flex-1 px-4 py-2.5 rounded-xl glass glass-text text-sm placeholder:glass-text-faint focus:outline-none focus:ring-1 focus:ring-white/30"
                    placeholder="Add a task…" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && add()}
                />
                <button onClick={add} className="px-4 py-2.5 rounded-xl glass hover-glass glass-text transition-all" aria-label="Add">
                    <Plus className="size-4" />
                </button>
            </div>
            <ul className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
                {todos.map(t => (
                    <li key={t.id} className="group flex items-center gap-3 px-4 py-4 rounded-xl glass-panel-subtle hover:glass-panel transition-all cursor-pointer" onClick={() => toggle(t.id)}>
                        {t.done ? <CheckCircle2 className="size-5 text-emerald-400 shrink-0" /> : <Circle className="size-5 glass-text-faint shrink-0" />}
                        <span className={cn("flex-1 text-sm font-medium", t.done ? "line-through glass-text-faint" : "glass-text")}>{t.text}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity glass-text-faint hover:text-red-400" onClick={e => { e.stopPropagation(); remove(t.id); }}>
                            <Trash2 className="size-4" />
                        </button>
                    </li>
                ))}
            </ul>
            <p className="text-xs glass-text-faint text-right mt-2">{todos.filter(t => t.done).length}/{todos.length} done</p>
        </div>
    );
}

function NotesContent() {
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

function MusicContent() {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(35);
    const [current, setCurrent] = useState(0);
    const progressRef = useRef<HTMLDivElement>(null);

    const tracks = [
        { title: "Deep Focus", artist: "Lo-Fi Beats", duration: "3:42" },
        { title: "Rain & Coffee", artist: "Ambient Works", duration: "4:18" },
        { title: "Midnight Study", artist: "Chillhop", duration: "5:02" },
        { title: "Forest Morning", artist: "Nature Sounds", duration: "6:30" },
    ];

    return (
        <div className="flex flex-col gap-4 h-full p-8 pt-10">
            <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                    <Music className="size-6 text-violet-400" />
                    Music & Sounds
                </DialogTitle>
            </DialogHeader>
            {/* Now playing */}
            <div className="flex items-center gap-4 p-4 glass-panel-subtle rounded-xl">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shrink-0 flex items-center justify-center">
                    <Music className="size-8 text-white/70" />
                </div>
                <div>
                    <p className="text-lg font-bold glass-text">{tracks[current].title}</p>
                    <p className="text-sm glass-text-muted">{tracks[current].artist}</p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-1 mt-2">
                <div ref={progressRef} className="h-1.5 glass rounded-full overflow-hidden cursor-pointer" onClick={e => {
                    const rect = progressRef.current!.getBoundingClientRect();
                    setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
                }}>
                    <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs glass-text-faint">
                    <span>1:{String(Math.round(progress * 0.42)).padStart(2, "0")}</span>
                    <span>{tracks[current].duration}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 glass-text my-2">
                <button onClick={() => setCurrent(c => Math.max(0, c - 1))} className="hover-glass p-2.5 rounded-xl glass-text-muted hover:glass-text transition-colors" aria-label="Prev">
                    <SkipBack className="size-6" />
                </button>
                <button onClick={() => setPlaying(p => !p)} className="size-14 rounded-full glass flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl" aria-label={playing ? "Pause" : "Play"}>
                    {playing
                        ? <span className="flex gap-1.5"><span className="w-1.5 h-5 rounded-full bg-current" /><span className="w-1.5 h-5 rounded-full bg-current" /></span>
                        : <Play className="size-6 ml-1 glass-text fill-current" />}
                </button>
                <button onClick={() => setCurrent(c => Math.min(tracks.length - 1, c + 1))} className="hover-glass p-2.5 rounded-xl glass-text-muted hover:glass-text transition-colors" aria-label="Next">
                    <SkipForward className="size-6" />
                </button>
            </div>

            <div className="border-t border-white/10 pt-6 mt-auto">
                <AmbientSection />
            </div>
        </div>
    );
}

function GoalContent() {
    const [sessions, setSessions] = useState(4);
    const goal = 8;
    const pct = Math.min(100, (sessions / goal) * 100);
    const circumference = 2 * Math.PI * 56;

    return (
        <div className="flex flex-col items-center gap-8 h-full p-8 pt-14">
             <DialogHeader className="sr-only">
                <DialogTitle>Daily Goal</DialogTitle>
            </DialogHeader>
            <div className="relative size-48 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="glass-text-faint" strokeOpacity="0.15" />
                    <circle cx="64" cy="64" r="56" fill="none" stroke="url(#goalGrad)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)} style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    <defs>
                        <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold glass-text">{sessions}</span>
                    <span className="text-sm glass-text-faint font-medium">of {goal} sessions</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold glass-text">Focus Progress</p>
                <p className="text-base glass-text-muted mt-2">{goal - sessions > 0 ? `${goal - sessions} more to go!` : "You've reached your goal! 🏆"}</p>
            </div>
            <div className="flex items-center gap-6 mt-4">
                <button onClick={() => setSessions(s => Math.max(0, s - 1))} className="size-12 rounded-2xl glass hover-glass glass-text flex items-center justify-center text-2xl font-bold transition-all hover:scale-105 active:scale-95">−</button>
                <span className="glass-text font-mono text-2xl w-10 text-center">{sessions}</span>
                <button onClick={() => setSessions(s => Math.min(goal, s + 1))} className="size-12 rounded-2xl glass hover-glass glass-text flex items-center justify-center text-2xl font-bold transition-all hover:scale-105 active:scale-95">+</button>
            </div>
        </div>
    );
}

/* ─── Dock definition ─────────────────────────────────────────── */
const DOCK_APPS: DockApp[] = [
    { id: "tasks", name: "Tasks", icon: "https://cdn.jim-nielsen.com/macos/512/meistertask-task-management-2017-03-10.png?rf=1024" },
    { id: "notes", name: "Notes", icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024" },
    { id: "music", name: "Music", icon: "https://cdn.jim-nielsen.com/macos/512/music-2025-11-13.png?rf=1024" },
    { id: "goal", name: "Goal", icon: "https://cdn.jim-nielsen.com/macos/512/rocketsim-for-xcode-simulator-2025-11-17.png?rf=1024" },
    { id: "settings", name: "Settings", icon: "https://cdn.jim-nielsen.com/macos/512/system-settings-2025-11-14.png?rf=1024" },
];

/* ─── Main export ─────────────────────────────────────────────── */
export function MiniAppDock({ className }: { className?: string }) {
    const [openApp, setOpenApp] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    const renderContent = () => {
        switch (openApp) {
            case "tasks": return <TodoContent />;
            case "notes": return <NotesContent />;
            case "music": return <MusicContent />;
            case "goal": return <GoalContent />;
            case "settings": return <SettingsPanels />;
            default: return null;
        }
    };

    const getDialogWidth = () => {
        switch (openApp) {
            case "tasks": return "sm:max-w-lg h-[620px]";
            case "notes": return "sm:max-w-xl h-[560px]";
            case "music": return "sm:max-w-md h-[700px]";
            case "goal": return "sm:max-w-sm h-[540px]";
            case "settings": return "sm:max-w-[1100px] h-[720px]";
            default: return "sm:max-w-md";
        }
    }

    return (
        <>
            <MacOSDock
                apps={DOCK_APPS}
                onAppClick={(id) => setOpenApp(prev => prev === id ? null : id)}
                openApps={openApp ? [openApp] : []}
                className={className}
            />

            <Dialog open={!!openApp} onOpenChange={(open) => !open && setOpenApp(null)}>
                <DialogContent className={cn(
                    "p-0 overflow-hidden glass backdrop-blur-3xl border-white/10 shadow-2xl animate-in zoom-in-95 duration-200",
                    getDialogWidth(),
                    openApp === 'settings' && "border-none" // Settings handles its own background look
                )}>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        </>
    );
}
