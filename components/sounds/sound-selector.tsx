"use client";

import { Button } from "@/components/ui/button";
import useSound from "@/store/use-sound";
import { Music } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input";
import { toast } from "sonner";

const sounds = [
    { key: "rain" as const, label: "Rain", icon: '🌧️', source: '/sounds/rain/rain_1.mp3' },
    { key: "fire" as const, label: "Fire", icon: '🔥', source: '/sounds/fire/fire_1.mp3' },
    { key: "windy" as const, label: "Windy", icon: '💨', source: '/sounds/windy/windy_1.mp3' },
];

export function SoundscapeSelector() {
    const { sound, type, isPlaying, setSound, handleApply } = useSound();
    const [isVisible, setIsVisible] = useState(false);
    const [inputUrl, setInputUrl] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!sound) return;
        const audio = new Audio(sounds.find(s => s.key === sound)?.source);
        audio.loop = true;
        audio.volume = 1;
        audioRef.current = audio;
        if (!audio) return;
    }, [sound]);

    useEffect(() => {
        if (audioRef.current && type === 'soundscape') {
            if (isPlaying) audioRef.current.play();
            else audioRef.current.pause();
        }
        if (isPlaying) setIsVisible(false);
    }, [isPlaying, type]);

    return (
        <div className="absolute top-12 left-0 m-4">
            <div className="flex">
                <Button
                    size='icon'
                    variant={"outline"}
                    onClick={() => setIsVisible(!isVisible)}
                    disabled={isPlaying}
                >
                    <Music />
                </Button>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            key="box"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="pl-2 flex space-x-2">
                                {sounds.map((s) => (
                                    <Button
                                        key={s.key}
                                        size='icon'
                                        variant={sound === s.key ? "secondary" : "ghost"}
                                        onClick={() => {
                                            if (type === 'youtube') {
                                                toast.info("Close YouTube sound before playing soundscape.")
                                                return
                                            };
                                            setSound(s.key)
                                        }}
                                        className="cursor-pointer border-none shadow-2xl"
                                    >
                                        {s.icon}
                                    </Button>
                                ))}
                                <Popover>
                                    <PopoverTrigger>
                                        <YoutubeIcon />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                placeholder="Paste YouTube link..."
                                                value={inputUrl}
                                                onChange={(e) => setInputUrl(e.target.value)}
                                            />
                                            <Button
                                                onClick={() => {
                                                    handleApply(inputUrl)
                                                    setIsVisible(!isVisible)
                                                }}
                                                disabled={!inputUrl}
                                                className="w-full"
                                            >
                                                Apply Link
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

type YoutubeIconProps = {
    size?: string;
};

export const YoutubeIcon = ({ size = "1rem" }: YoutubeIconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 180"><path fill="red" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z" /><path fill="#FFF" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" /></svg>
);

