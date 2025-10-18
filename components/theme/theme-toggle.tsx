'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
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

    if (!mounted) return null;

    return (
        <div className="absolute top-0 left-0 m-4">
            <Button
                className='cursor-pointer'
                variant={"outline"}
                size="icon"
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            >
                {theme === 'dark' ? <Sun className="w-4 h-4 animate-slide-down" /> : <Moon className="w-4 h-4 animate-slide-down" />}
            </Button>
        </div>
    );
}
