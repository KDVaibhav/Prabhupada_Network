"use client";

import Image from "next/image";
import React from "react";

export type GalleryItemData = {
  _id: string;
  title: string;
  mediaType: "image" | "video";
  url: string;
  eventId?: string;
  uploadedAt: string;
};

export default function GallleryItem({
  item,
  index,
  onOpen,
}: {
  item: GalleryItemData;
  index: number;
  onOpen: (index: number) => void;
}) {
  return (
    <button
      onClick={() => onOpen(index)}
      className="group block relative w-full overflow-hidden rounded-2xl bg-gray-100 shadow hover:shadow-xl transition will-change-transform"
      title={item.title}
    >
      {item.mediaType === "image" ? (
        <div className="relative w-full pb-[66%]">
          <Image
            src={item.url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transform-gpu group-hover:scale-[1.03] transition duration-300"
          />
        </div>
      ) : (
        <div className="relative w-full pb-[56.25%] bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-white/90 text-black grid place-items-center group-hover:scale-110 transition">
              ▶
            </div>
          </div>
          {/* thumbnail via youtube if possible */}
          <YouTubeThumb url={item.url} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
      <div className="absolute top-2 left-2 inline-flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/90 text-black backdrop-blur">
          {item.mediaType === "image" ? "Image" : "Video"}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
          {item.title}
        </p>
      </div>
    </button>
  );
}

function getYouTubeId(url: string): string | null {
  // Supports typical YouTube URL formats
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function YouTubeThumb({ url }: { url: string }) {
  const id = getYouTubeId(url);
  if (!id) return <div className="absolute inset-0 bg-gray-800" />;
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return (
    <Image
      src={thumb}
      alt="Video thumbnail"
      fill
      className="object-cover opacity-80 group-hover:opacity-100 transition"
    />
  );
}
