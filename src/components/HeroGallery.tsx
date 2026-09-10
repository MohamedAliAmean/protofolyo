"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";

type HeroGalleryProps = {
  images: string[];
  alt: string;
};

const SWIPE_OFFSET = 100;
const SWIPE_VELOCITY = 600;

function FrontCard({
  src,
  alt,
  canSwipe,
  exitDirection,
  onSwipe,
}: {
  src: string;
  alt: string;
  canSwipe: boolean;
  exitDirection: number;
  onSwipe: (direction: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (!canSwipe) return;

    if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
      onSwipe(1);
      return;
    }

    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
      onSwipe(-1);
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-20 cursor-grab overflow-hidden rounded-[1.6rem] bg-navy-deep shadow-[var(--shadow)] active:cursor-grabbing"
      style={{ x, rotate, touchAction: "none" }}
      drag={canSwipe ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0.85, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        x: exitDirection * 460,
        rotate: exitDirection * 14,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 90vw, 480px"
        className="pointer-events-none object-cover object-[50%_18%] select-none"
        unoptimized={src.startsWith("http")}
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </motion.div>
  );
}

export function HeroGallery({ images, alt }: HeroGalleryProps) {
  const photos = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState(1);

  if (photos.length === 0) return null;

  const front = photos[index % photos.length];
  const back = photos.length > 1 ? photos[(index + 1) % photos.length] : null;
  const canSwipe = photos.length > 1;

  function handleSwipe(direction: 1 | -1) {
    setExitDirection(direction);
    setIndex((current) => (current + 1) % photos.length);
  }

  return (
    <div className="relative mx-auto w-full">
      <div className="relative aspect-[4/5] overflow-visible pb-[7%] pr-[9%]">
        <div className="absolute inset-0 right-[9%] bottom-[7%]">
          {back ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 translate-x-[10%] translate-y-[8%] rotate-[3.5deg] overflow-hidden rounded-[1.6rem] bg-navy-deep shadow-[var(--shadow)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={back}
                alt=""
                className="h-full w-full object-cover object-[50%_18%]"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ) : (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[10%_-6%_-6%_12%] z-0 rotate-[2.5deg] rounded-[1.75rem] opacity-90"
              style={{
                background:
                  "linear-gradient(145deg, var(--sky-soft), var(--accent) 55%, var(--navy))",
              }}
            />
          )}

          <AnimatePresence initial={false} mode="wait">
            <FrontCard
              key={`${front}-${index}`}
              src={front}
              alt={alt}
              canSwipe={canSwipe}
              exitDirection={exitDirection}
              onSwipe={handleSwipe}
            />
          </AnimatePresence>
        </div>
      </div>

      {canSwipe ? (
        <p className="mt-3 text-center text-xs text-ink-muted">
          Swipe the top card to reveal the next photo
        </p>
      ) : null}
    </div>
  );
}
