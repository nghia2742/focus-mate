# Focus Mate

A modern, minimal productivity app built with Next.js. It combines a liquid-glass Pomodoro timer, ambient soundscapes, a draggable YouTube player, and an AI Consultant powered by OpenRouter.

## Features

- Pomodoro Timer (Liquid Glass)
  - Minimal 3D glass circle with realistic highlights
  - Smooth circular progress ring around the glass
  - Countdown displayed at the center
  - Glass-styled control buttons (Start/Pause/Reset)
- Soundscapes
  - Built-in ambient loops: Rain, Fire, Windy
  - Toggle and control playback with the UI
- YouTube Player (Draggable)
  - Paste a YouTube link from the Sound selector
  - Draggable floating player (mobile/desktop)
  - Minimize, close, and fullscreen controls
- AI Consultant (OpenRouter)
  - Draggable, responsive widget (initially bottom-left)
  - Markdown-formatted answers with improved readability
  - Category selector (icon + popover) for focus areas:
    - Productivity, Time Management, Deep Work, Habits, Wellness, Learning
  - Category is applied via system context (not added to user messages)
  - Textarea input and Send icon; conversation scrollable within widget
  - Server-side proxy to OpenRouter keeps the API key private
- Theming and UX
  - Light/Dark theme toggle
  - Global glass/liquid background with subtle grid and blobs
  - Toast notifications for actions and errors
- State Management
  - Zustand store for sound/YT state

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Framer Motion
- Zustand
- OpenRouter (Chat Completions API)
- lucide-react icons
- react-markdown + remark-gfm

## Getting Started

1) Install
```bash
# with yarn (recommended by the repo)
yarn
# or npm / pnpm / bun
```

2) Environment
Create `.env.local` and add your OpenRouter key:
```
OPENROUTER_API_KEY=sk-or-...
```

3) Run dev
```bash
yarn dev
# open http://localhost:3000
```

4) Build
```bash
yarn build
yarn start
```

## Usage Tips

- AI Consultant
  - Open the widget and drag it anywhere on the screen.
  - Click the filter icon next to the textarea to choose a focus category.
  - Answers are rendered with headings, lists, tables, code, and quotes.
- YouTube Player
  - In the sound selector, paste your YouTube link.
  - Drag the player as needed; minimize or fullscreen with the window controls.
- Timer
  - Start/Pause/Reset controls beneath the glass timer.
  - The outer ring fills smoothly as the session progresses.

## Code Pointers

- AI API proxy: `app/api/consultant/route.ts`
- AI widget: `components/ai/ai-consultant.tsx`
- Timer: `components/pomodoro/pomodoro-timer.tsx`
- Sound selector: `components/sounds/sound-selector.tsx`
- YouTube player: `components/sounds/youtube-player.tsx`
- Theme toggle/provider: `components/theme/*`

## Notes

- The AI widget and YouTube player are draggable with framer-motion and constrained to the viewport.
- The AI category is applied to model context (system prompt) and not injected into the user’s visible message.
- The app uses a glassmorphism visual style with attention to readability and performance.

## License

MIT
