"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PrismaClient } from '@prisma/client';
import { useRouter } from "next/navigation";
import { use } from "react";

const prisma = new PrismaClient();

// Placeholder data
const article = {
  heroImage: "/placeholder-article.jpg",
  title: "How This FTC Team Used AI to Win Regionals",
  author: "Ava Robotics",
  date: "May 2, 2024",
  category: "Robotics Competitions",
  content: [
    { type: "heading", text: "The Power of AI in Robotics" },
    { type: "paragraph", text: "This season, Team 12345 from California shocked the FTC world by integrating a custom AI vision system into their robot. But how did they do it—and what can your team learn?" },
    { type: "pullquote", text: "'We wanted to make scouting smarter, not harder.'" },
    { type: "heading", text: "Building the Vision System" },
    { type: "paragraph", text: "Using open-source tools and a lot of trial and error, the team trained their AI to recognize game elements in real time. The result? Faster cycles, fewer mistakes, and a trip to the finals." },
    { type: "didyouknow", text: "Did you know? FTC teams can use TensorFlow for on-robot AI!" },
    { type: "heading", text: "What's Next for Student Robotics?" },
    { type: "paragraph", text: "With AI becoming more accessible, expect to see even more creative uses in next year's competitions. Will your team be next?" },
  ],
};

const related = [
  { title: "Top 5 VEX Bots at Worlds That Blew Our Minds", image: "/placeholder_main.png" },
  { title: "NASA's New Mars Rover Has a Trick You Won't Believe", image: "/placeholder_main.png" },
  { title: "What It's Like to Work at SpaceX (From a 23-Year-Old Engineer)", image: "/placeholder_main.png" },
];

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    setIsAdmin(typeof window !== "undefined" && localStorage.getItem("makeminds_token") === "loggedin");
  }, []);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/articles/${slug}`);
        const data = await res.json();
        if (data && !data.error) {
          setArticle(data);
        } else {
          setError("Not found");
        }
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  // Fetch all articles for related suggestions
  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/articles`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Sort by date descending, exclude current article
          const sorted = data
            .filter((a) => a.slug !== slug)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          setRelatedArticles(sorted);
        }
      } catch {
        setRelatedArticles([]);
      }
    }
    fetchRelated();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles?slug=${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + btoa("MakEMindsADMIN:admin"),
        },
      });
      if (res.ok) {
        router.push("/");
      } else {
        setError("Failed to delete article");
      }
    } catch {
      setError("Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error || !article) return <div className="min-h-screen flex items-center justify-center text-red-400">{error || "Not found"}</div>;

  // --- Content rendering logic ---
  let contentHtml = "";
  let isAI = false;
  if (typeof article.content === "string") {
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(article.content);
      if (parsed && typeof parsed === "object" && parsed.content) {
        contentHtml = parsed.content;
        isAI = true;
      } else {
        contentHtml = article.content;
      }
    } catch {
      // Not JSON, just render as is
      contentHtml = article.content;
    }
  } else {
    contentHtml = article.content;
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#101c2c', color: '#fff' }}>
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 relative mb-8 bg-[#1a2942] flex items-center justify-center shadow-lg">
        <Image src={article.image_url || "/placeholder_main.png"} alt="Hero" width={1200} height={400} priority className="w-full h-full object-cover object-center rounded-b-3xl max-w-3xl mx-auto" />
      </div>
      <div className="w-full px-2 md:px-8">
        {/* Title & Meta */}
        <div className="mb-6 flex flex-col gap-2 items-center text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-[#5fa0cf] text-[#101c2c] shadow">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight" style={{ color: '#fff' }}>{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#5fa0cf] justify-center">
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-10" style={{ color: '#fff' }}>
          {isAI ? (
            <div className="mb-4 text-white/90" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          ) : (
            <p className="mb-4 text-white/90">{contentHtml}</p>
          )}
        </div>
        {/* Admin Remove Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Remove Article"}
            </button>
          </div>
        )}
        {/* Share Buttons */}
        <div className="flex gap-4 mb-14 justify-center">
          <button className="bg-[#5fa0cf] text-[#101c2c] px-4 py-2 rounded-full font-bold hover:bg-[#1a2942] hover:text-white transition shadow">Share on X</button>
          <button className="bg-[#5fa0cf] text-[#101c2c] px-4 py-2 rounded-full font-bold hover:bg-[#1a2942] hover:text-white transition shadow">Share on Instagram</button>
          <button className="bg-[#5fa0cf] text-[#101c2c] px-4 py-2 rounded-full font-bold hover:bg-[#1a2942] hover:text-white transition shadow">Copy Link</button>
        </div>
        {/* Related Articles */}
        <div className="mb-20">
          <h3 className="text-xl font-bold mb-6 text-[#5fa0cf] text-center">Explore more like this</h3>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar justify-center w-full px-4 snap-x snap-mandatory">
            {relatedArticles.map((rel, idx) => (
              <div key={rel.slug} className="min-w-[220px] max-w-[220px] bg-[#1a2942] rounded-2xl shadow-lg p-4 flex flex-col items-center flex-shrink-0 snap-center border border-[#22335b]">
                <Image src={rel.image_url || "/placeholder_main.png"} alt={rel.title} width={220} height={96} className="w-full h-24 object-cover rounded mb-2" />
                <h4 className="font-semibold text-md text-center text-white leading-tight">{rel.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 