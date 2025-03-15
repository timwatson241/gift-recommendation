// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gift Reminder App",
  description:
    "Never forget a birthday or struggle to find the perfect gift again!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background min-h-screen flex flex-col`}
      >
        <Providers>
          {/* Nav header */}
          <header className="bg-card shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="text-primary-600 font-bold text-xl">
                    Gift Reminder
                  </a>
                </div>
                <nav className="flex space-x-4">
                  <a
                    href="/dashboard"
                    className="text-text-secondary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/login"
                    className="text-text-secondary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <footer className="bg-card mt-auto py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-text-light text-sm">
                © {new Date().getFullYear()} Gift Reminder App. All rights
                reserved.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
