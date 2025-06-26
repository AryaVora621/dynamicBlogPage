"use client";

import React from "react";
import Image from "next/image";

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
  { title: "Top 5 VEX Bots at Worlds That Blew Our Minds", image: "/placeholder-2.jpg" },
  { title: "NASA's New Mars Rover Has a Trick You Won't Believe", image: "/placeholder-1.jpg" },
  { title: "What It's Like to Work at SpaceX (From a 23-Year-Old Engineer)", image: "/placeholder-3.jpg" },
];

export default function ArticlePage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#101c2c', color: '#fff' }}>
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 relative mb-8 bg-[#1a2942] flex items-center justify-center shadow-lg">
        <Image src={article.heroImage} alt="Hero" width={1200} height={400} className="w-full h-full object-cover object-center rounded-b-3xl max-w-3xl mx-auto" />
      </div>
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        {/* Title & Meta */}
        <div className="mb-6 flex flex-col gap-2 items-center text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-[#5fa0cf] text-[#101c2c] shadow">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight" style={{ color: '#fff' }}>{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#5fa0cf] justify-center">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-10" style={{ color: '#fff' }}>
          {article.content.map((block, idx) => {
            if (block.type === "heading")
              return <h2 key={idx} className="text-2xl font-bold mt-10 mb-3 text-[#5fa0cf]">{block.text}</h2>;
            if (block.type === "paragraph")
              return <p key={idx} className="mb-4 text-white/90">{block.text}</p>;
            if (block.type === "pullquote")
              return <blockquote key={idx} className="border-l-4 pl-4 italic my-8 text-lg bg-[#1a2942] rounded-xl py-4 px-6 shadow" style={{ borderColor: '#5fa0cf', color: '#5fa0cf' }}>{block.text}</blockquote>;
            if (block.type === "didyouknow")
              return <div key={idx} className="bg-[#5fa0cf] text-[#101c2c] rounded-xl px-4 py-3 my-8 font-semibold shadow">{block.text}</div>;
            return null;
          })}
        </div>
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
            {related.map((rel, idx) => (
              <div key={idx} className="min-w-[220px] max-w-[220px] bg-[#1a2942] rounded-2xl shadow-lg p-4 flex flex-col items-center flex-shrink-0 snap-center border border-[#22335b]">
                <Image src={rel.image} alt={rel.title} width={220} height={96} className="w-full h-24 object-cover rounded mb-2" />
                <h4 className="font-semibold text-md text-center text-white leading-tight">{rel.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 