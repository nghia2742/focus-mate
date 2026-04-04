'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for managing browser notifications.
 */
export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof window !== 'undefined' ? Notification.permission : 'default'
    );

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return 'denied';
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    }, []);

    const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.warn("Notifications are not supported in this browser.");
            return;
        }

        let currentPermission = Notification.permission;
        
        // Request permission if not already asked
        if (currentPermission === 'default') {
            console.log("Requesting notification permission...");
            currentPermission = await Notification.requestPermission();
            setPermission(currentPermission);
        }

        if (currentPermission === 'granted') {
            console.log("Sending notification:", title);
            try {
                const n = new Notification(title, {
                    icon: '/favicon.ico',
                    ...options,
                });
                
                setTimeout(() => n.close(), 5000);
                
                n.onclick = () => {
                    window.focus();
                    n.close();
                };
            } catch (e) {
                console.error("Failed to create notification object:", e);
            }
        } else {
            console.warn("Cannot send notification. Permission is:", currentPermission);
        }
    }, []);

    return {
        permission,
        requestPermission,
        sendNotification,
        isSupported: typeof window !== 'undefined' && 'Notification' in window,
    };
}
