"use client";

import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { useUser } from "@/hooks/use-user";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function InitialLoader() {
  const { isLoading } = useUser();
  const [show, setShow] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // We only hide the loader when both the user API has finished loading
  // AND the hello animation has completed.
  useEffect(() => {
    if (!isLoading && isAnimationComplete) {
      // Optional: Add a small delay before fading out to let the user see the completed signature
      const timer = setTimeout(() => {
        setShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAnimationComplete]);

  // Fallback: if somehow it takes too long, hide it anyway after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background"
        >
          <AppleHelloEnglishEffect
            className="text-foreground h-24"
            speed={0.4}
            onAnimationComplete={() => setIsAnimationComplete(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
