'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

const themes = [
    { id: "light", icon: <Sun className="w-4 h-4" /> },
    { id: "dark", icon: <Moon className="w-4 h-4" /> }
];

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 't' && event.shiftKey) {
            event.preventDefault();
            const currentIndex = themes.findIndex(t => t.id === theme);
            const nextIndex = (currentIndex + 1) % themes.length;
            setTheme(themes[nextIndex].id);
        }
    }, [setTheme, theme]);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [mounted, handleKeyDown]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="transition-all size-8 flex-shrink-0 hover:bg-transparent dark:hover:bg-transparent"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 6, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex items-center justify-center"
                >
                    {mounted ? (theme === 'light' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-violet-500" />) : <LoaderIcon className='w-4 h-4 animate-spin' />}
                </motion.span>
            </AnimatePresence>
        </Button>
    );
}
