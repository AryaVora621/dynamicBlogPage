"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AIArticlePage() {
  const [mode, setMode] = useState<"ai" | "upload">("ai");
  // AI Article states
  const [prompt, setPrompt] = useState("");
  const [aiContent, setAIContent] = useState("");
  const [aiTitle, setAITitle] = useState("");
  const [aiImage, setAIImage] = useState<string>("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState("");
  const [aiCategory, setAICategory] = useState("");
  // Upload Article states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // AI Article: Generate summary/article and image
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAILoading(true);
    setAIError("");
    setAIContent("");
    setAITitle("");
    setAIImage("");
    setAICategory("");
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      console.log("AI response:", data);
      console.log("AI content field:", data.content);
      if (data.error) throw new Error(data.error);
      setAIContent(data.content || "");
      setAITitle(data.title || prompt.slice(0, 60));
      setAIImage(data.image_url || "");
      setAICategory(data.category || "");
    } catch (err: unknown) {
      setAIError((err as Error).message || "Failed to generate article. Try again.");
    } finally {
      setAILoading(false);
    }
  };

  // Publish handler (for both modes)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    let data;
    if (mode === "ai") {
      data = {
        title: aiTitle,
        slug: aiTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        content: aiContent,
        category: aiCategory || "STEM Breakthroughs Made Simple",
        date: new Date().toISOString().slice(0, 10),
        image_url: aiImage,
        author: "Team MakEMinds",
      };
    } else {
      data = {
        title,
        slug,
        content,
        category,
        date,
        image_url: imageUrl,
        author: "Team MakEMinds",
      };
    }
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("MakEMindsADMIN:admin"),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Article published!");
        setTimeout(() => router.push("/"), 1200);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to publish article");
      }
    } catch {
      setError("Failed to publish article");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center py-10 px-2 md:px-8 w-full">
      <div className="w-full max-w-2xl mb-8 flex gap-4 justify-center">
        <button
          className={`px-6 py-2 rounded-full font-bold transition ${mode === "ai" ? "bg-green-400 text-[#101c2c]" : "bg-gray-800 text-white"}`}
          onClick={() => setMode("ai")}
        >
          AI Article
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold transition ${mode === "upload" ? "bg-blue-400 text-[#101c2c]" : "bg-gray-800 text-white"}`}
          onClick={() => setMode("upload")}
        >
          Upload Article
        </button>
      </div>
      {/* AI Article Mode */}
      {mode === "ai" && (
        <form onSubmit={handleAIGenerate} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full flex flex-col gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">Generate Article with AI</h1>
          <textarea
            placeholder="Enter a topic or prompt (e.g. 'NASA's new Mars rover')"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none min-h-[80px]"
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-[#101c2c] font-bold py-2 rounded mt-2"
            disabled={aiLoading}
          >
            {aiLoading ? "Generating..." : "Generate"}
          </button>
          {aiError && <div className="text-red-400 text-sm text-center">{aiError}</div>}
        </form>
      )}
      {/* AI Article Preview and Publish */}
      {mode === "ai" && aiContent && (
        <div className="w-full mb-8 bg-[#1a2942] rounded-2xl shadow-lg p-4 flex flex-col items-center border border-[#22335b]">
          <span className="uppercase text-xs font-bold tracking-wider mb-2 text-[#5fa0cf]">AI Article Preview</span>
          <div className="min-w-[220px] max-w-[220px] w-full flex flex-col items-center">
            <div className="w-full h-28 mb-3 relative">
              <Image src={aiImage || "/placeholder_main.png"} alt="Preview" fill sizes="220px" className="object-cover rounded" />
            </div>
            <h3 className="font-semibold text-md text-center text-white leading-tight mb-2">{aiTitle || "Article Title"}</h3>
            {aiCategory && <div className="text-xs text-[#5fa0cf] mb-1">{aiCategory}</div>}
            <div className="text-xs text-white/60 mb-2">{new Date().toISOString().slice(0, 10)}</div>
            <div className="text-white/80 text-sm text-center mb-2 prose prose-invert" dangerouslySetInnerHTML={{ __html: aiContent }} />
            <form onSubmit={handlePublish} className="w-full flex flex-col items-center mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-2">Publish</button>
              {message && <div className="text-green-400 text-sm text-center mt-2">{message}</div>}
              {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Upload Article Mode */}
      {mode === "upload" && (
        <form onSubmit={handlePublish} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full flex flex-col gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">Upload Article</h1>
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
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2">Publish</button>
          {message && <div className="text-green-400 text-sm text-center">{message}</div>}
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        </form>
      )}
    </div>
  );
} 