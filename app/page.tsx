// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Gift Reminder App
        </h1>

        <p className="text-xl mb-8 text-center">
          Never forget a birthday or struggle to find the perfect gift again!
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          id="features"
        >
          {/* Feature 1: Birthday Reminders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Birthday Reminders</h2>
            <p>Get timely notifications before each special day.</p>
          </div>

          {/* Feature 2: Gift Suggestions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Smart Gift Ideas</h2>
            <p>Personalized gift suggestions based on age and interests.</p>
          </div>

          {/* Feature 3: One-Click Purchase */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Easy Purchasing</h2>
            <p>One-click ordering through your favorite retailers.</p>
          </div>

          {/* Feature 4: History Tracking */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Gift History</h2>
            <p>Keep track of past gifts to avoid duplicates.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-block"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-lg inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
