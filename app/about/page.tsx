import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">
        Assalamu Alaikum!
      </h1>

      <p className="mt-4 text-xl text-gray-700">
        Welcome to My First Next.js Website 🚀
      </p>

      <Link href="/about">
        <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Start Learning
        </button>
      </Link>
    </div>
  );
}