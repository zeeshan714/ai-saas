"use client";

export default function Home() {
  const handleClick = () => {
    alert("Welcome Muhammad Zeeshan! 🚀");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">
        Assalamu Alaikum!
      </h1>

      <p className="mt-4 text-xl text-gray-700">
        Welcome to My First Next.js Website 🚀
      </p>

      <button
        onClick={handleClick}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Start Learning
      </button>
    </div>
  );
}