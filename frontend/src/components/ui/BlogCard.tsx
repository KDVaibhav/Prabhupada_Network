"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

type Blog = {
  _id: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  date: Date;
  tags: String[];
};

export const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className="w-full group/card">
      <Link href={`/blogs/${blog._id}`} className="block">
        <div
          className="cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 bg-black"
          style={{
            backgroundImage: `url('${blog.imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50 group-hover/card:bg-black/60 transition-opacity duration-300" />
          <div className="flex flex-row items-center space-x-4 z-10">
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-50 relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {blog.author}
              </p>
              <p className="text-sm text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {Math.ceil(blog.content.length / 600)} min read
              </p>
            </div>
          </div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10 leading-snug line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {blog.title}
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4 line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {blog.content
                .replace(/<[^>]*>/g, "")
                .replace(/\s+/g, " ")
                .trim()
                .substring(0, 150)}
              ...
            </p>
          </div>
          {blog.tags.map((tag) => (
            <span className="bg-black/40 text-white text-xs px-2 py-1 rounded mr-2 mb-2 inline-block backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};
