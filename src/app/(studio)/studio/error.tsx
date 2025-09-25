"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your logging service or console
    console.error("Subscription page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-semibold text-red-600">
        Something went wrong on the Subscription page
      </h2>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
