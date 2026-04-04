'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { useSettings } from '@/store/use-settings';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Send } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * NotificationExample Component
 * 
 * This component demonstrates how to use the Browser Notifications API
 * in Focus Mate. Use this as a reference for implementing notifications
 * in other parts of the application.
 */
export function NotificationExample() {
    const { permission, requestPermission, sendNotification, isSupported } = useNotifications();
    const settings = useSettings();

    const toggleNotifications = async () => {
        if (!isSupported) {
            toast.error("Notifications are not supported in this browser.");
            return;
        }

        if (settings.notificationsEnabled) {
            settings.setNotificationsEnabled(false);
            toast.info("Notifications disabled");
            return;
        }

        if (permission === 'default') {
            const result = await requestPermission();
            if (result === 'granted') {
                settings.setNotificationsEnabled(true);
                toast.success("Notifications enabled");
            } else {
                toast.error("Permission denied. Enable notifications in your browser settings.");
            }
        } else if (permission === 'granted') {
            settings.setNotificationsEnabled(true);
            toast.success("Notifications enabled");
        } else {
            toast.error("Please enable browser notification permission first");
        }
    };

    const handleTestNotification = () => {
        if (!settings.notificationsEnabled) {
            toast.warning("Enable notifications first to send a test.");
            return;
        }
        
        sendNotification("Focus Mate Test!", {
            body: "This is a test notification to verify your setup.",
            icon: '/favicon.ico'
        });
        toast.info("Test notification sent!");
    };

    if (!isSupported) {
        return (
            <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center">
                <p className="font-semibold">Browser Notifications Not Supported</p>
                <p className="text-sm opacity-80 mt-1">Your browser does not support the native Notification API.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-8 rounded-[32px] glass-panel backdrop-blur-md border border-white/20 shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-black/80 dark:text-white/80">Notification Center</h3>
                    <p className="text-xs text-black/40 dark:text-white/40 mt-1">
                        Status: <span className={cn(
                            "font-semibold uppercase tracking-wider",
                            permission === 'granted' ? "text-green-500" : "text-amber-500"
                        )}>{permission}</span>
                    </p>
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleNotifications}
                    className={cn(
                        "rounded-full h-12 w-12 transition-all duration-300",
                        settings.notificationsEnabled 
                            ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]" 
                            : "text-black/30 dark:text-white/20 hover:bg-black/5 dark:hover:bg-white/5 border border-black/5 dark:border-white/5"
                    )}
                    title={settings.notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                >
                    {settings.notificationsEnabled ? (
                        <Bell className="w-6 h-6 animate-in fade-in zoom-in duration-300" />
                    ) : (
                        <BellOff className="w-6 h-6 animate-in fade-in zoom-in duration-300" />
                    )}
                </Button>
            </div>

            <div className="h-px bg-black/5 dark:bg-white/5 w-full" />

            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Send className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-black/70 dark:text-white/70">Test Delivery</p>
                        <p className="text-xs text-black/40 dark:text-white/40">Send a test alert to your system.</p>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={handleTestNotification}
                        disabled={!settings.notificationsEnabled}
                        className="rounded-xl shadow-lg shadow-primary/20"
                    >
                        Send
                    </Button>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-black/30 dark:text-white/30 px-1">Best Practices</p>
                    <ul className="text-xs text-black/60 dark:text-white/60 space-y-2 px-1">
                        <li className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>Browser permissions must be "granted" for notifications to appear.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>On macOS/Windows, check "Do Not Disturb" settings if alerts don't show.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>Notifications often require a user "interaction" to trigger permission prompts.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
