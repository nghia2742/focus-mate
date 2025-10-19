"use client";

import { Button } from "@/components/ui/button";
import useSound from "@/store/use-sound";
import { Music } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const sounds = [
    { key: "rain" as const, label: "Rain", icon: '🌧️' },
    { key: "fire" as const, label: "Fire", icon: '🔥' },
    { key: "windy" as const, label: "Windy", icon: '💨' },
];

export function SoundscapeSelector() {
    const { sound, setSound } = useSound();
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="absolute top-12 left-0 m-4">
            <div className="flex">
                <Button
                    size='icon'
                    variant={"outline"}
                    onClick={() => setIsVisible(!isVisible)}
                >
                    <Music />
                </Button>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            key="box"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }} // khi unmount
                            transition={{ duration: 0.4 }}
                        >
                            <div className="pl-2 flex space-x-2">
                                {sounds.map((s) => (
                                    <Button
                                        key={s.key}
                                        size='icon'
                                        variant={sound === s.key ? "secondary" : "ghost"}
                                        onClick={() => setSound(s.key)}
                                        className="cursor-pointer border-none shadow-2xl"
                                    >
                                        {s.icon}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
