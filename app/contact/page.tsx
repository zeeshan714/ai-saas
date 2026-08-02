import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600">
        Contact Us 📩
      </h1>

      <p className="mt-4 text-lg text-gray-700 text-center max-w-md">
        اگر آپ کا کوئی سوال ہے یا آپ ہم سے رابطہ کرنا چاہتے ہیں تو نیچے دیے گئے بٹن سے ہوم پیج پر جا سکتے ہیں۔
      </p>

      <Link href="/">
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}