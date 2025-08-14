"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Carousel } from "./ui/apple-cards-carousel";
import { useSelector } from "react-redux";
import DataInsertModal from "./ui/DataInsertModal";
import { BlogFields } from "@/app/data";
import Link from "next/link";

export const BlogSection = () => {
  const [blogs, setBlogs] = useState<
    { title: string; date: string; imageUrl: string; description: string, content: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) => state.auth
  );
  const cards = blogs.map((blog, index) => (
    <Card key={blog.title} card={blog} index={index} />
  ));
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`,
          { withCredentials: true }
        );
        setBlogs(blogsData.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching the blogs", error);
      }
    };
    fetchBlogs(); 
  }, []);
  return (
    <div className="w-full h-full py-2 bg-bgApp2 rounded-2xl">
      <h2 className="max-w-7xl pl-4 py-2 mx-auto text-2xl font-bold text-fontApp font-sans">
        Blogs
      </h2>
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="p-4 text-fontApp">Loading...</div>
        ) : (
          <Carousel items={cards} />
        )}
        {isAuthenticated && (
          <Link
            href={"/blogs"}
            className="mt-4 bg-primary2 text-white p-2 rounded-2xl shadow-md font-bold hover:text-fontApp2"
          >
            Write Blog
          </Link>
        )}
      </div>
    </div>
  );
};
