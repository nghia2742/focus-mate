
"use client";

import useSound from "@/store/use-sound";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import ReactPlayer from "react-player";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function YoutubePlayer() {
  const { inputUrl, isYoutubeReady, isYoutubePlaying, handleClose } = useSound();

  if (!isYoutubeReady) return null;

  return (
    <motion.div
      className="absolute group bottom-4 right-4 z-5 w-full max-w-md rounded-xl"
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <Button className="absolute right-0 top-0 z-10 invisible group-hover:visible" size={"icon"} variant={'default'} onClick={handleClose}> <X className="font-bold" /> </Button>
        <ReactPlayer
          src={inputUrl}
          playing={isYoutubePlaying}
          controls
          width="100%"
          height="100%"
          style={{ borderRadius: "0.75rem" }}
          onError={() => {
            handleClose();
            toast.error("Failed to load the video. Please check the URL and try again.");
          }}
        />
      </div>
    </motion.div>
  );
}