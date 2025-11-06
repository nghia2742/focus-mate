"use client";

import useSound from "@/store/use-sound";
import { motion } from "framer-motion";
import { ChevronsUpDown, ExternalLink, Minus, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ReactPlayer = dynamic(
  () => import("react-player").then((m) => m.default),
  { ssr: false }
) as unknown as (props: any) => JSX.Element;

export function YoutubePlayer() {
  const { inputUrl, isYoutubeReady, isPlaying, handlePlay, handleClose } = useSound();
  const [isMinimized, setIsMinimized] = useState(false);
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

  if (!isYoutubeReady) return null;

  return (
    <div ref={boundsRef} className="fixed inset-0 z-40 pointer-events-none">
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
    </div>
  );
}