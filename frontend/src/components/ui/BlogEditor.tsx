"use client";
import TextEditor from "@/components/ui/TextEditor";
import axios from "axios";
import React, { useState } from "react";
import ImageKit from "imagekit-javascript";

// var imagekit = new ImageKit({
//   publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
//   urlEndpoint: process.env.env.NEXT_PUBLNEXT_PUBLIC_IMAGEKIT_URLIC_IMAGEKIT_PRIVATE_KEY,
//   authenticationEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signed-url`,
// })

export const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const togglePreview = () => {
    setPreview(!preview);
  };
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setCoverImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  const removeImage = () => {
    setCoverImage(null);
  };
  const submitBlog = async () => {
    const token = localStorage.getItem("token");
    function base64ToBlob(base64Data: string, contentType = "image/png") {
      const byteCharacters = atob(base64Data.split(",")[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      return new Blob(byteArrays, { type: contentType });
    }
    setLoading(true);
    try {
      // Fetch a fresh token/signature for the cover image
      let imageUrl = null;
      if (coverImage) {
        const coverImageResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signed-url`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const {
          signature: coverSignature,
          expire: coverExpire,
          token: coverToken,
        } = coverImageResponse.data;

        const formData = new FormData();
        formData.append("file", coverImage);
        formData.append("fileName", `blog-cover-${Date.now()}`);
        formData.append("folder", "/Prabhupada_Network/blogs/coverImage");
        formData.append("signature", coverSignature);
        formData.append("expire", coverExpire);
        formData.append("token", coverToken);
        formData.append(
          "publicKey",
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
        );

        const uploadResponse = await axios.post(
          process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
          formData
        );
        imageUrl = uploadResponse.data.url;
      }

      let uploadedImages: Record<string, string> = {};
      const imgRegex = /<img[^>]+src=["'](data:image\/[^"']+)["']/g;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        const base64Image = match[1];
        if (base64Image.startsWith("data:image")) {
          const blob = base64ToBlob(base64Image);
          const inlineImagesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signed-url`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const {
            signature: inlineSignature,
            expire: inlineExpire,
            token: inlineToken,
          } = inlineImagesResponse.data;
          const formData = new FormData();
          formData.append("file", blob, `blog-image-${Date.now()}.png`);
          formData.append("fileName", `blog-image-${Date.now()}`);
          formData.append("folder", "/Prabhupada_Network/blogs/contentImage");
          formData.append("signature", inlineSignature);
          formData.append("expire", inlineExpire);
          formData.append("token", inlineToken);
          formData.append(
            "publicKey",
            process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
          );

          const uploadResponse = await axios.post(
            process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
            formData
          );
          uploadedImages[base64Image] = uploadResponse.data.url;
        }
      }

      // Replace Base64 with CDN URLs
      const finalContent = content.replace(
        /<img([^>]+)src="(data:image\/[^">]+)"/g,
        (match, attributes, base64) => {
          const url = uploadedImages[base64];
          return url ? `<img${attributes}src="${url}"` : match;
        }
      );

      // Set the first image as default if no cover image is provided
      if (!imageUrl && Object.keys(uploadedImages).length > 0) {
        imageUrl = Object.values(uploadedImages)[0];
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`,
        {
          title,
          content: finalContent,
          author,
          imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Blog submitted successfully!");
      setTitle("");
      setAuthor("");
      setContent("");
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to submit blog.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-center">Blog Editor</h2>
      <button
        onClick={togglePreview}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {preview ? "Edit" : "Preview"}
      </button>
      {/* Title Input */}
      <input
        type="text"
        className="w-full border px-3 py-2 rounded"
        placeholder="Enter Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Author Input */}
      <input
        type="text"
        className="w-full border px-3 py-2 rounded"
        placeholder="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* Cover Image Preview (styled as an input field) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div
            className={`w-full border px-3 py-2 rounded ${
              coverImage ? "h-20" : "h-10"
            } flex items-center justify-center bg-gray-50 overflow-hidden`}
          >
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  onClick={removeImage}
                  className="absolute right-2 top-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </>
            ) : (
              <span className="text-gray-400">No cover image selected</span>
            )}
          </div>
        </div>
        <button
          onClick={addImage}
          className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 whitespace-nowrap"
        >
          Add Cover Image
        </button>
      </div>
      
      <TextEditor content={content} setContent={setContent} preview={preview} />
      <div className="flex justify-center">
      <button
          onClick={submitBlog}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded`}
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </div>
    </div>
  );
};
