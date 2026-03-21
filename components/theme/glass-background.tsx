export function GlassBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-zinc-950">
      {/* Deep Base Gradient */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)'
        }}
      />

      {/* Animated Orbs/Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/40 blur-[100px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/40 blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-600/40 blur-[100px] animate-blob animation-delay-4000" />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
    </div>
  );
}