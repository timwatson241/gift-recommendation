// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardTitle, Badge } from "../components/ui/Card";
import Button from "../components/ui/Button";

// Define the Recipient type
type Recipient = {
  id: string;
  name: string;
  birthday: string;
  age: number;
  gender: string | null;
  interests: string;
  likes: string;
  budget: number;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch recipients data
  useEffect(() => {
    const fetchRecipients = async () => {
      if (status !== "authenticated") return;

      try {
        const response = await fetch("/api/recipients");

        if (!response.ok) {
          throw new Error("Failed to fetch recipients");
        }

        const data = await response.json();
        setRecipients(data);
      } catch (err: any) {
        console.error("Error fetching recipients:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, [status]);

  // Format birthday to display format
  const formatBirthday = (dateString: string) => {
    // Create date with time set to noon to avoid timezone issues
    const date = new Date(dateString);
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
    );

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      timeZone: "UTC", // Force UTC timezone for display
    }).format(utcDate);
  };

  // Calculate days until next birthday
  const getDaysUntilBirthday = (birthdayString: string) => {
    const today = new Date();
    const birthday = new Date(birthdayString);

    // Set birthday to this year
    birthday.setFullYear(today.getFullYear());

    // If birthday has already passed this year, set to next year
    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }

    // Calculate difference in days
    const diffTime = birthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Get badge variant based on days until birthday
  const getBadgeVariant = (days: number) => {
    if (days === 0) return "danger";
    if (days <= 7) return "warning";
    if (days <= 30) return "primary";
    return "default";
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  // Authenticated content
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Gift Reminders Dashboard</h1>

        <Link
          href="/dashboard/add-recipient"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Recipient
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {recipients.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <CardTitle className="mb-2">No recipients yet</CardTitle>
            <p className="mb-6 text-gray-600">
              Add your first recipient to get started!
            </p>
            <Link
              href="/dashboard/add-recipient"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md inline-block shadow transition-colors"
            >
              Add First Recipient
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipients.map((recipient) => {
            const daysUntilBirthday = getDaysUntilBirthday(recipient.birthday);
            const badgeVariant = getBadgeVariant(daysUntilBirthday);

            return (
              <Card key={recipient.id} hover>
                <CardContent>
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle>{recipient.name}</CardTitle>
                    <Badge variant={badgeVariant}>
                      {daysUntilBirthday === 0
                        ? "Today!"
                        : daysUntilBirthday === 1
                        ? "Tomorrow!"
                        : `${daysUntilBirthday} days`}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Birthday:</span>{" "}
                    {formatBirthday(recipient.birthday)} ({recipient.age} years
                    old)
                  </p>

                  <div className="space-y-2 mb-4">
                    {recipient.interests &&
                      recipient.interests.trim() !== "" && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Interests:</span>{" "}
                          {recipient.interests}
                        </p>
                      )}

                    {recipient.likes && recipient.likes.trim() !== "" && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Likes:</span>{" "}
                        {recipient.likes}
                      </p>
                    )}

                    {recipient.budget > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Gift Budget:</span> $
                        {recipient.budget.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/dashboard/recipient/${recipient.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
