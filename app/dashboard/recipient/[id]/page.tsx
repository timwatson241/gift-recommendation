// app/dashboard/recipient/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Badge,
} from "../../../components/ui/Card";

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
  createdAt: string;
  updatedAt: string;
};

export default function RecipientDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  // Extract the ID - handle both string and string[] cases
  const recipientId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch recipient data
  useEffect(() => {
    const fetchRecipient = async () => {
      if (status !== "authenticated" || !recipientId) return;

      try {
        const response = await fetch(`/api/recipients/${recipientId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error:", response.status, errorText);

          try {
            // Try to parse as JSON if possible
            const errorJson = JSON.parse(errorText);
            throw new Error(
              `API error: ${errorJson.message || "Unknown error"}`
            );
          } catch (parseError) {
            // If it's not JSON, use the text directly
            throw new Error(
              `API error: ${response.status} - ${errorText || "Unknown error"}`
            );
          }
        }

        const data = await response.json();
        setRecipient(data);
      } catch (err: any) {
        console.error("Error fetching recipient:", err);
        setError(err.message || "Failed to fetch recipient details");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchRecipient();
    }
  }, [status, recipientId]);

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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  // Not found state
  if (!recipient) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
          <p className="font-medium">Not Found</p>
          <p>Recipient not found</p>
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate days until birthday
  const daysUntilBirthday = getDaysUntilBirthday(recipient.birthday);
  const badgeVariant = getBadgeVariant(daysUntilBirthday);
  const birthdayLabel =
    daysUntilBirthday === 0
      ? "Today!"
      : daysUntilBirthday === 1
      ? "Tomorrow!"
      : `${daysUntilBirthday} days`;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link
        href="/dashboard"
        className="text-blue-600 hover:text-blue-800 inline-block mb-6"
      >
        &larr; Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{recipient.name}</CardTitle>
            <Badge variant={badgeVariant}>{birthdayLabel}</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Birthday:</span>{" "}
                  {formatBirthday(recipient.birthday)}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {recipient.age}{" "}
                  years old
                </p>
                {recipient.gender && (
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {recipient.gender}
                  </p>
                )}
                <p>
                  <span className="font-medium">Gift Budget:</span> $
                  {recipient.budget.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Preferences</h2>
              <div className="space-y-2">
                {recipient.interests && (
                  <div>
                    <p className="font-medium">Interests:</p>
                    <p className="ml-2 text-gray-600">{recipient.interests}</p>
                  </div>
                )}

                {recipient.likes && (
                  <div>
                    <p className="font-medium">Likes/Favorites:</p>
                    <p className="ml-2 text-gray-600">{recipient.likes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Gift Ideas</h2>
            <p className="text-gray-500 italic">
              Gift suggestions will appear here once we add the AI integration.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() =>
              router.push(`/dashboard/recipient/${recipient.id}/edit`)
            }
          >
            Edit Details
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              if (confirm("Are you sure you want to delete this recipient?")) {
                // Delete logic would go here
                alert("Delete functionality will be implemented soon");
              }
            }}
          >
            Delete
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
