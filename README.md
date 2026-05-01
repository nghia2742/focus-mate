# Focus Mate

A modern, minimal productivity app built with Next.js. It combines a liquid-glass Pomodoro timer and ambient soundscapes to help you maintain deep focus.

## Features

- Pomodoro Timer (Liquid Glass)
  - Minimal 3D glass circle with realistic highlights
  - Smooth circular progress ring around the glass
  - Countdown displayed at the center
  - Glass-styled control buttons (Start/Pause/Reset/Skip)
- Soundscapes
  - Built-in ambient loops: Rain, Fire, Windy
  - Toggle and control playback volume via the floating Sound Selector UI
- Theming and UX
  - Light/Dark theme toggle
  - Global glass/liquid background with dynamic wallpapers
  - Toast notifications for actions and errors
  - Customizable focus, short break, and long break intervals
- State Management
  - Zustand store for settings

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Framer Motion
- Zustand
- lucide-react icons

## Getting Started

1) Install
```bash
# with yarn (recommended by the repo)
yarn
# or npm / pnpm / bun
```

2) Run dev
```bash
yarn dev
# open http://localhost:3000
```

3) Build
```bash
yarn build
yarn start
```

## Usage Tips

- Timer
  - Start/Pause/Reset controls beneath the glass timer.
  - The outer ring fills smoothly as the session progresses.
  - Go to Settings (gear icon) to configure intervals, auto-start, and alarm sounds.
- Soundscapes
  - Click the floating Music icon on the left to open the Sound Selector.
  - Choose between Rain, Fire, Windy, or None to help you focus.
  - Adjust the volume slider as needed.

## Code Pointers

- Timer: `components/pomodoro/pomodoro-timer.tsx`
- Sound selector: `components/sounds/sound-selector.tsx`
- Settings dialog: `components/settings-dialog.tsx`
- Theme toggle/provider: `components/theme/*`

## Notes

- The app uses a glassmorphism visual style with attention to readability and performance.
- Background wallpapers can be loaded from `/public/backgrounds/`.

## License

MIT
