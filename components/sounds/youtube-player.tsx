"use client";

import useSound from "@/store/use-sound";
import { motion } from "framer-motion";
import { ChevronsUpDown, ExternalLink, Minus, X, Youtube } from "lucide-react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

export function YoutubePlayer() {
  const { inputUrl, isYoutubeReady, isPlaying, handlePlay, handleClose, handleApply } = useSound();
  const [isMinimized, setIsMinimized] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [urlInput, setUrlInput] = useState(inputUrl || "");
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
      <div className="fixed top-0 left-32 m-4 pointer-events-auto">
        <Button size="icon" variant="outline" onClick={() => setOpenPicker(true)} className="rounded-full bg-white/20 backdrop-blur-md border-white/30">
          <Youtube className="size-4" />
        </Button>
      </div>

      <Modal open={openPicker} onOpenChange={setOpenPicker}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">YouTube Audio</div>
            <Button size="icon-sm" variant="ghost" onClick={() => setOpenPicker(false)}>✕</Button>
          </div>
          <div className="mt-3 space-y-3">
            <Input placeholder="Paste YouTube link..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpenPicker(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!urlInput.trim()) return;
                  handleApply(urlInput.trim());
                  setOpenPicker(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
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
                url={inputUrl}
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