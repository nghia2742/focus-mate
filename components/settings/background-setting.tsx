import fs from "fs"
import path from "path"
import { BackgroundSettingClient } from "./background-setting-client"

export function BackgroundSetting() {
    let backgrounds: string[] = [];
    try {
        const bgDir = path.join(process.cwd(), 'public/backgrounds');
        if (fs.existsSync(bgDir)) {
            backgrounds = fs.readdirSync(bgDir).filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
        }
    } catch (e) {
        console.error("Failed to read backgrounds folder:", e);
    }

    return <BackgroundSettingClient backgrounds={backgrounds} />
}
