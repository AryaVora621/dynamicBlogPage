"use client";
import React from "react";
import Link from "next/link";

export default function TopBarAuthButtons() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setLoggedIn(localStorage.getItem("makeminds_token") === "loggedin");
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("makeminds_token");
    window.location.href = "/";
  };
  return loggedIn ? (
    <div className="flex gap-3 items-center">
      <Link href="/ai-article" className="px-4 py-2 rounded-full bg-green-400 text-[#101c2c] font-semibold hover:bg-green-500 transition">AI Article</Link>
      <Link href="/editor" className="px-4 py-2 rounded-full bg-[#5fa0cf] text-[#101c2c] font-semibold hover:bg-[#3e7ca6] transition">Editor</Link>
      <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-[#22335b] text-white font-semibold hover:bg-[#5fa0cf] hover:text-[#101c2c] transition">Logout</button>
    </div>
  ) : (
    <Link href="/login" className="px-4 py-2 rounded-full bg-[#5fa0cf] text-[#101c2c] font-semibold hover:bg-[#3e7ca6] transition">Login</Link>
  );
} 