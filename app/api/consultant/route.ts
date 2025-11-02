import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = "openai/gpt-oss-20b:free", system, temperature = 0.7 } = body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages[] is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    const payload = {
      model,
      messages: [
        ...(system ? [{ role: "system", content: String(system) }] : []),
        ...messages,
      ],
      temperature,
    };

    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      // OpenRouter recommends sending headers for attribution; optional
      // next: { revalidate: 0 } // ensure no caching
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Upstream error", details: text }, { status: 502 });
    }

    const data = await res.json();

    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";

    return NextResponse.json({ content, raw: data });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error", details: String(err) },
      { status: 500 }
    );
  }
}