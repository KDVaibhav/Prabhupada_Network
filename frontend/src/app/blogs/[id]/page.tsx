"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconChevronLeft,
  IconChevronRight,
  IconShare2,
} from "@tabler/icons-react";

type Blog = {
  _id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  date: string;
  tags?: string[];
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => (params?.id as string) || "", [params]);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog/${id}`
        );
        setBlog(res.data);

        // Also fetch list to compute prev/next
        const all = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`
        );
        const list: Blog[] = all.data;
        // Sort by date desc
        const sorted = [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const index = sorted.findIndex((b) => b._id === res.data._id);
        setPrevId(index > 0 ? sorted[index - 1]._id : null);
        setNextId(
          index >= 0 && index < sorted.length - 1 ? sorted[index + 1]._id : null
        );
      } catch (e) {
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="p-6 text-fontApp">Loading...</div>;
  if (error || !blog)
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">{error || "Blog not found"}</p>
        <button
          className="px-4 py-2 rounded-lg bg-primary2 text-white"
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    );

  const formattedDate = new Date(blog.date).toLocaleDateString();
  const readingMinutes = (() => {
    const text = blog.content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = text ? text.split(" ").length : 0;
    return Math.max(1, Math.ceil(words / 200));
  })();

  return (
    <article className="max-w-4xl mx-auto my-6 md:my-10 bg-white rounded-2xl shadow-md overflow-hidden">
      {blog.imageUrl && (
        <div className="relative h-56 md:h-96 w-full">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <h1 className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white text-2xl md:text-4xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
            {blog.title}
          </h1>
        </div>
      )}

      <div className="px-5 md:px-8 py-6">
        {!blog.imageUrl && (
          <h1 className="text-2xl md:text-4xl font-bold text-fontApp2 mb-2">
            {blog.title}
          </h1>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-fontApp mb-6">
          <span className="font-medium">{blog.author}</span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <time dateTime={blog.date}>{formattedDate}</time>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span>{readingMinutes} min read</span>
          <button
            className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            title="Copy link"
          >
            <IconShare2 className="h-4 w-4" />
            Share
          </button>
        </div>

        <div
          style={{ lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{
            __html: blog.content
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
              ),
          }}
        />

        {/* Bottom navigation */}
        <div className="mt-10 pt-6 border-t flex items-center justify-between gap-4">
          <button
            disabled={!prevId}
            onClick={() => prevId && router.push(`/blogs/${prevId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            <IconChevronLeft className="h-5 w-5" />
            Previous
          </button>
          <button
            disabled={!nextId}
            onClick={() => nextId && router.push(`/blogs/${nextId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-40"
          >
            Next
            <IconChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
