"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. یہاں useRouter امپورٹ کیا

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // 2. یہاں ہک ڈالا

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Logging in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Success! You are logged in.");
      
      // 3. لاگ ان کامیاب ہوتے ہی ڈیش بورڈ پر ری ڈائریکٹ کر دے گا
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000); // 1 سیکنڈ کے بعد ری ڈائریکٹ ہوگا تاکہ میسج نظر آئے
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-blue-500 text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-all"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-emerald-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}