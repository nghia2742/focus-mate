import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const bgDir = path.join(process.cwd(), 'public', 'backgrounds');
        console.log(`API [GET] /api/backgrounds - Reading directory: ${bgDir}`);

        let backgrounds: string[] = [];

        if (fs.existsSync(bgDir)) {
            backgrounds = fs.readdirSync(bgDir).filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
            console.log(`API [GET] /api/backgrounds - Found ${backgrounds.length} backgrounds`);
        } else {
            console.warn(`API [GET] /api/backgrounds - Directory not found: ${bgDir}`);
        }
        
        return NextResponse.json(backgrounds);
    } catch (e: any) {
        console.error("API [GET] /api/backgrounds - Error reading backgrounds:", e);
        return NextResponse.json({ error: "Internal Server Error", message: e.message }, { status: 500 });
    }
}

