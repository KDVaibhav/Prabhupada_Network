"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  JSX,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";
import DOMPurify from "dompurify";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  imageUrl: string;
  title: string;
  location?: string;
  author?: string;
  date: string;
  description: string;
  content?: string;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 230; // (md:w-96)
      const gap = 4;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };
  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full  overflow-x-scroll overscroll-x-auto py-4 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row gap-4 md:gap-6 pl-4",
              "max-w-7xl mx-auto" // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="last:pr-[5%] rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mr-10">
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  const cleanContent = DOMPurify.sanitize(card.content || "");
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-50 overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit  z-[60] my-10 p-4 md:p-10 rounded-3xl font-sans relative"
            >
              <button
                className="sticky top-4 h-8 w-8 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 " />
              </button>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-2xl md:text-5xl font-semibold text-fontApp2 mt-4"
              >
                {card.title}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.description}` : undefined}
                className="text-base md:text-2xl font-semibold text-fontApp mt-4"
              >
                {card.description}
              </motion.p>
              <motion.div
                layoutId={layout ? `title-${card.content}` : undefined}
                className="text-base md:text-2xl font-semibold text-fontApp mt-4"
              >
                <div>
                  <div
                    style={{
                      lineHeight: "1.6",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: cleanContent
                        ? cleanContent
                            .replace(
                              /<ul>/g,
                              '<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0;">'
                            )
                            .replace(
                              /<ol>/g,
                              '<ol style="list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0;">'
                            )
                            .replace(
                              /<li>/g,
                              '<li style="margin: 0.25em 0; display: list-item;">'
                            )
                        : "",
                    }}
                  />
                </div>
              </motion.div>
              <motion.p
                layoutId={layout ? `title-${card.location}` : undefined}
                className="text-xl md:text-3xl font-semibold text-fontApp2 mt-4 flex justify-end"
              >
                {card.location}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.date}` : undefined}
                className="text-xl md:text-3xl font-semibold text-fontApp2 mt-4 flex justify-end"
              >
                {card.date.split("T")[0]}
              </motion.p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-64 overflow-hidden flex flex-col items-start justify-start relative z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-40 p-3 md:p-4">
          <h3 className="text-white text-base md:text-lg font-semibold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
            {card.title}
          </h3>
          {card.description && (
            <p className="mt-1 text-white/90 text-xs md:text-sm truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {card.description}
            </p>
          )}
        </div>
        <BlurImage
          src={card.imageUrl}
          alt={card.title}
          fill
          className=" absolute z-10 inset-0 object-cover"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
