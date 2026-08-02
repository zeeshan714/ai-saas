import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        MyWebsite 🚀
      </div>
      <div className="space-x-6">
        <Link href="/" className="hover:underline font-medium">
          Home
        </Link>
        <Link href="/about" className="hover:underline font-medium">
          About
        </Link>
        <Link href="/contact" className="hover:underline font-medium">
          Contact
        </Link>
      </div>
    </nav>
  );
}