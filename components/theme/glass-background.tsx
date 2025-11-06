"use client";

export function GlassBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Large soft blobs */}
      <div className="absolute -top-40 -left-20 h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-indigo-400/20 via-fuchsia-400/20 to-cyan-400/20 blur-3xl animate-[float_18s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 blur-[90px] animate-[float_22s_ease-in-out_infinite_reverse]" />
      <div className="absolute -bottom-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-gradient-to-bl from-purple-500/20 to-pink-400/20 blur-3xl animate-[float_26s_ease-in-out_infinite]" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent dark:from-white/10" />
    </div>
  );
}