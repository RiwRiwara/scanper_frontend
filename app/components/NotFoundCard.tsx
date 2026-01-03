"use client";

import { type UserNotFound } from "../lib/api";

interface NotFoundCardProps {
  userNotFound: UserNotFound;
}

export default function NotFoundCard({ userNotFound }: NotFoundCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-blue-500 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
        Welcome, {userNotFound.display_name || "User"}!
      </h2>

      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {userNotFound.message}
      </p>

      <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-left">
        <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
          How to use ScanPer Bot:
        </h3>
        <ol className="text-sm text-green-600 dark:text-green-300 space-y-2 list-decimal list-inside">
          <li>Open LINE app</li>
          <li>Add ScanPer as a friend</li>
          <li>Send an image or PDF file</li>
          <li>Get OCR results instantly!</li>
        </ol>
      </div>
    </div>
  );
}
