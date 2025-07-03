"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "MakEMindsADMIN" && password === "admin") {
      // Store a simple session token in localStorage
      localStorage.setItem("makeminds_token", "loggedin");
      router.push("/editor");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
} 