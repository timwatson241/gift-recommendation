// app/dashboard/recipient/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "../../../../components/ui/Card";

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

export default function EditRecipient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const recipientId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    gender: "",
    interests: "",
    likes: "",
    budget: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        const response = await fetch(`/api/recipients/${recipientId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch recipient details");
        }

        const data: Recipient = await response.json();

        // Format date for input field (YYYY-MM-DD)
        const birthday = new Date(data.birthday);
        const formattedDate = birthday.toISOString().split("T")[0];

        setFormData({
          name: data.name,
          birthday: formattedDate,
          gender: data.gender || "",
          interests: data.interests || "",
          likes: data.likes || "",
          budget: data.budget.toString(),
        });
      } catch (err: any) {
        console.error("Error fetching recipient:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipient();
  }, [status, recipientId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Process text fields to clean input
  const processInput = (input: string) => {
    return input.trim();
  };

  // Calculate age based on birthday
  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      // Calculate age from birthday
      const age = calculateAge(formData.birthday);

      // Process interests and likes
      const interests = processInput(formData.interests);
      const likes = processInput(formData.likes);

      // Call API endpoint to update the recipient
      const response = await fetch(`/api/recipients/${recipientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          birthday: formData.birthday,
          age,
          gender: formData.gender,
          interests,
          likes,
          budget: parseFloat(formData.budget) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update recipient");
      }

      // Redirect back to recipient details page
      router.push(`/dashboard/recipient/${recipientId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href={`/dashboard/recipient/${recipientId}`}
        className="text-blue-600 hover:text-blue-800 inline-block mb-6"
      >
        &larr; Back to Recipient Details
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Recipient</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Display error message if any */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Birthday field */}
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Gender field */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Interests field */}
            <div>
              <label
                htmlFor="interests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Interests (comma separated)
              </label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="sports, reading, video games"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            {/* Likes field */}
            <div>
              <label
                htmlFor="likes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Likes/Favorites (comma separated)
              </label>
              <textarea
                id="likes"
                name="likes"
                value={formData.likes}
                onChange={handleChange}
                placeholder="Minecraft, dinosaurs, Spider-Man"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            {/* Budget field */}
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gift Budget ($)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3">
            <Link
              href={`/dashboard/recipient/${recipientId}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
