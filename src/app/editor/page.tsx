"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("makeminds_token");
      if (token !== "loggedin") {
        router.replace("/login");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("MakEMindsADMIN:admin"),
        },
        body: JSON.stringify({ title, slug, content, category, date, image_url: imageUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Article published!");
        setTitle("");
        setSlug("");
        setContent("");
        setCategory("");
        setDate("");
        setImageUrl("");
      } else {
        setError(data.error || "Failed to publish article");
      }
    } catch {
      setError("Failed to publish article");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center py-10 px-2 md:px-8 w-full">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        {/* Editor Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-8 rounded-lg shadow-lg w-full flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-white mb-4 text-center">Publish New Article</h1>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Slug (unique, e.g. my-article)"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none min-h-[120px]"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Image URL (https://...)"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
          />
          {message && <div className="text-green-400 text-sm text-center">{message}</div>}
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2"
          >
            Publish
          </button>
        </form>

        {/* Live Preview */}
        <div className="w-full bg-[#1a2942] rounded-2xl shadow-lg p-4 flex flex-col items-center border border-[#22335b]">
          <span className="uppercase text-xs font-bold tracking-wider mb-2 text-[#5fa0cf]">Live Preview</span>
          <div className="min-w-[220px] max-w-[220px] w-full flex flex-col items-center">
            <div className="w-full h-28 mb-3 relative">
              {imageUrl ? (
                <Image src={imageUrl} alt="Preview" fill sizes="220px" className="object-cover rounded" />
              ) : (
                <div className="w-full h-full bg-[#22335b] rounded flex items-center justify-center text-white/40">No Image</div>
              )}
            </div>
            <h3 className="font-semibold text-md text-center text-white leading-tight mb-2">{title || "Article Title"}</h3>
            <div className="text-xs text-[#5fa0cf] mb-1">{category || "Category"}</div>
            <div className="text-xs text-white/60 mb-2">{date || "YYYY-MM-DD"}</div>
            <div className="text-white/80 text-sm text-center line-clamp-4">{content || "Article content preview will appear here."}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 