"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Processing...");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Success! Check your email for confirmation.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm font-medium text-emerald-400">{message}</p>}
      </div>
    </div>
  );
}