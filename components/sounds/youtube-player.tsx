"use client";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import useSound from "@/store/use-sound";
import { motion } from "framer-motion";
import { ChevronsUpDown, ExternalLink, Minus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function YoutubePlayer() {
  const { inputUrl, isYoutubeReady, isPlaying, handlePlay, handleClose, handleApply } = useSound();
  const [isMinimized, setIsMinimized] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (playerRef.current?.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else {
        const el = playerRef.current as unknown as { webkitRequestFullscreen?: () => void };
        el?.webkitRequestFullscreen?.();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else {
        const doc = document as unknown as { webkitExitFullscreen?: () => void };
        doc?.webkitExitFullscreen?.();
      }
    }
  };

  const handleMinimize = () => {
    if (document.fullscreenElement) {
      const doc = document as unknown as { webkitExitFullscreen?: () => void };
      doc?.webkitExitFullscreen?.();
    }
    setIsMinimized(!isMinimized);
  }

  // Toolbar button near Theme and Settings (top-left)
  return (
    <div ref={boundsRef} className="fixed inset-0 z-40 pointer-events-none">
      <div className="fixed top-28 left-0 mx-4 pointer-events-auto">
        <Button size="icon" variant="outline" onClick={() => setOpenPicker(true)} className="bg-white/20 backdrop-blur-md border-white/30">
          <Youtube size="64" />
        </Button>
      </div>

      <Modal open={openPicker} onOpenChange={setOpenPicker}>
        <YouTubePicker
          urlInput={inputUrl ?? ""}
          onApply={(u) => {
            handleApply(u);
            setOpenPicker(false);
          }}
          onClose={() => setOpenPicker(false)}
        />
      </Modal>

      {isYoutubeReady && (
        <motion.div
          className="absolute pointer-events-auto bottom-4 right-4 group w-[min(92vw,360px)] md:w-[min(92vw,480px)] overflow-hidden rounded-lg"
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          drag
          dragMomentum
          dragElastic={0.12}
          dragConstraints={boundsRef}
        >
          <div ref={playerRef}>
            {isMinimized && <Button className={cn("absolute bottom-0 right-0")} size={"icon"} onClick={() => setIsMinimized(!isMinimized)}> <ExternalLink className="-rotate-90" /> </Button>}
            <motion.div
              className={cn("aspect-video", isMinimized && "invisible")}
              animate={{ y: isMinimized ? 200 : 0, x: isMinimized ? 200 : 0, opacity: 1 }}
              transition={{ duration: 0.75 }}
            >
              <div className="flex p-1 px-2 gap-1 bg-muted w-full">
                <Button className="z-10 rounded-full size-4 bg-[#FF5F57]" size={"icon-sm"} onClick={handleClose}> <X className="size-3" /> </Button>
                <Button className="z-10 rounded-full size-4 bg-[#FFBD2E]" size={"icon-sm"} onClick={handleMinimize}> <Minus className="size-3" /> </Button>
                <Button className="z-10 rounded-full size-4 bg-[#28C940]" size={"icon-sm"} onClick={handleFullScreen}> <ChevronsUpDown className="size-3 -rotate-45" /> </Button>
              </div>
              <ReactPlayer
                src={inputUrl}
                playing={!!isPlaying}
                controls
                width="100%"
                height="100%"
                style={{ borderRadius: "0.75rem" }}
                onPlay={() => handlePlay(true)}
                onError={() => {
                  handleClose();
                  toast.error("Failed to load the video. Please check the URL and try again.");
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

type SearchItem = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string | null;
};

function YouTubePicker({
  urlInput,
  onApply,
  onClose,
}: {
  urlInput: string;
  onApply: (url: string) => void;
  onClose: () => void;
}) {
  const defaultQuery = "Ambience - Cozy Cafe Background Sounds for Studying, Reading, Working";
  const [q, setQ] = useState(defaultQuery);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  // simple debounce
  useEffect(() => {
    const handle = setTimeout(async () => {
      const query = q.trim();
      if (!query) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&max=10`);
        const data = await res.json();
        setResults(Array.isArray(data.items) ? data.items : []);
      } finally {
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(handle);
  }, [q]);

  function applyFromId(id: string) {
    const url = `https://www.youtube.com/watch?v=${id}`;
    onApply(url);
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 justify-center">
          <div><Youtube size="24" /></div>
          <div className="text-sm font-semibold">YouTube</div>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={onClose}>✕</Button>
      </div>

      <div className="mt-3 space-y-3">
        <div className="group relative">
          <Input
            placeholder="Search on YouTube..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pr-10"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              aria-label="Clear search"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search results */}
        <div className="max-h-[50vh] overflow-y-auto rounded-md">
          {loading ? (
            <div className="p-3 text-xs text-muted-foreground">Searching...</div>
          ) : results.length === 0 ? <></> : (
            <ul className="">
              {results.map((it) => (
                <li key={it.id}>
                  <button
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/5 text-left"
                    onClick={() => applyFromId(it.id)}
                  >
                    {it.thumbnail ? (
                      <Image src={it.thumbnail} alt="" width={56} height={36} className="w-14 h-9 rounded object-cover" />
                    ) : (
                      <div className="w-14 h-9 rounded bg-white/10" />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{it.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{it.channel}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


type YoutubeProps = {
  size: string;
};

const Youtube = ({ size }: YoutubeProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 72 72"><path fill="#ea5a47" d="M63.874 21.906a7.31 7.31 0 0 0-5.144-5.177C54.193 15.505 36 15.505 36 15.505s-18.193 0-22.73 1.224a7.31 7.31 0 0 0-5.144 5.177C6.91 26.472 6.91 36 6.91 36s0 9.528 1.216 14.095a7.31 7.31 0 0 0 5.144 5.177C17.807 56.495 36 56.495 36 56.495s18.193 0 22.73-1.223a7.31 7.31 0 0 0 5.144-5.177C65.09 45.528 65.09 36 65.09 36s0-9.528-1.216-14.094" /><path fill="#fff" d="M30.05 44.65L45.256 36L30.05 27.35Z" /><g fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="2"><path d="M63.874 21.906a7.31 7.31 0 0 0-5.144-5.177C54.193 15.505 36 15.505 36 15.505s-18.193 0-22.73 1.224a7.31 7.31 0 0 0-5.144 5.177C6.91 26.472 6.91 36 6.91 36s0 9.528 1.216 14.095a7.31 7.31 0 0 0 5.144 5.177C17.807 56.495 36 56.495 36 56.495s18.193 0 22.73-1.223a7.31 7.31 0 0 0 5.144-5.177C65.09 45.528 65.09 36 65.09 36s0-9.528-1.216-14.094" /><path strokeLinecap="round" strokeLinejoin="round" d="M30.05 44.65L45.256 36L30.05 27.35Z" /></g></svg>
);

export default Youtube;
