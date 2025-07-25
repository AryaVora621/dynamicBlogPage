"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Placeholder data for featured story
const featuredStory = {
  title: "FRC 2025 Game Reveal: What Teams Need to Know",
  image: "/placeholder_main.png",
  summary: "FIRST just dropped the new game! Here's what every team should know before kickoff.",
  slug: "sample-article",
};

const dailyHighlights = [
  "FTC teams get AI update!",
  "MIT's robot chef goes viral",
  "SpaceX launches student satellite",
  "VEX Worlds: Rule change surprise",
  "New AI tool for FRC scouting",
];

const categories = [
  { name: "All" },
  { name: "Robotics Competitions" },
  { name: "STEM Breakthroughs Made Simple" },
  { name: "Youth in Tech Spotlight" },
  { name: "Educator Resources" },
  { name: "Career Explorer" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Filter articles by category and search
  const filteredArticles = Array.isArray(articles)
    ? articles.filter(
        (a) =>
          (selectedCategory === "All" || (typeof a.category === 'string' && a.category === selectedCategory)) &&
          typeof a.title === 'string' && a.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#101c2c', color: '#fff' }}>
      <main className="flex flex-col items-center w-full px-2 md:px-6">
        {/* Featured Story Banner */}
        <section className="w-full rounded-3xl shadow-lg overflow-hidden mb-12 mt-8" style={{ background: 'linear-gradient(90deg, #22335b 0%, #5fa0cf 100%)' }}>
          <div className="flex flex-col md:flex-row items-center gap-8 p-8">
            <Image src={featuredStory.image} alt="Featured" width={400} height={224} priority className="w-full md:w-1/3 h-56 object-cover rounded-2xl shadow-md" />
            <div className="flex-1 flex flex-col items-start justify-center">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight" style={{ color: '#fff' }}>{featuredStory.title}</h1>
              <p className="text-lg mb-4 text-white/90">{featuredStory.summary}</p>
              <Link href={`/${featuredStory.slug}`}>
                <button className="font-semibold px-6 py-2 rounded-full shadow bg-[#101c2c] text-white hover:bg-[#5fa0cf] hover:text-[#101c2c] transition cursor-pointer">Read Story</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Category Filter */}
        <section className="w-full mb-6 flex flex-col gap-4 items-center">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:max-w-xl px-4 py-2 rounded-full bg-[#1a2942] text-white placeholder:text-[#5fa0cf] border border-[#22335b] focus:outline-none focus:ring-2 focus:ring-[#5fa0cf] shadow"
          />
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition shadow border border-[#22335b] ${selectedCategory === cat.name ? 'bg-[#5fa0cf] text-[#101c2c]' : 'bg-[#1a2942] text-white hover:bg-[#22335b]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Articles Carousel (filtered) */}
        <section className="w-full mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#5fa0cf' }}>Featured Articles</h2>
          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar justify-center w-full snap-x snap-mandatory pl-4 pr-4">
            {loading ? (
              <div className="text-white/70 text-center py-8 w-full">Loading articles...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-white/70 text-center py-8 w-full">No articles found.</div>
            ) : (
              filteredArticles.map((article) => (
                <Link href={`/${String(article.slug)}`} key={String(article.slug)}>
                  <div className="min-w-[220px] max-w-[220px] bg-[#1a2942] rounded-2xl shadow-lg p-4 flex flex-col items-center cursor-pointer hover:scale-105 transition border border-[#22335b] flex-shrink-0 snap-center">
                    <Image src={typeof article.image_url === 'string' ? article.image_url : "/placeholder_main.png"} alt={typeof article.title === 'string' ? article.title : ''} width={220} height={112} className="w-full h-28 object-cover rounded mb-3" />
                    <h3 className="font-semibold text-md text-center text-white leading-tight">{typeof article.title === 'string' ? article.title : ''}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Daily Highlights Strip */}
        <section className="w-full mb-12">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar justify-center w-full snap-x snap-mandatory pl-4 pr-4">
            {dailyHighlights.map((highlight) => (
              <div key={highlight} className="px-4 py-2 rounded-full font-medium shadow-sm bg-[#5fa0cf] text-[#101c2c] whitespace-nowrap text-sm flex-shrink-0 snap-center">
                {highlight}
              </div>
            ))}
          </div>
        </section>

        {/* Category Sections */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {categories.filter(cat => cat.name !== "All").map((cat) => (
            <div key={cat.name} className="rounded-2xl p-6 shadow-lg flex flex-col gap-2 bg-[#1a2942] border border-[#22335b]">
              <span className="uppercase text-xs font-bold tracking-wider mb-1 text-[#5fa0cf]">{cat.name}</span>
              <p className="font-medium text-white/90">{cat.name === "Robotics Competitions" ? "FTC/FRC/VEX articles, event recaps, rule changes" : cat.name === "STEM Breakthroughs Made Simple" ? "New AI tools, space missions, biomedical innovations" : cat.name === "Youth in Tech Spotlight" ? "Features on student projects, competition winners, scholarships" : cat.name === "Educator Resources" ? "Shareable, class-ready articles + PDF versions" : "Simple intros to real jobs in tech"}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
