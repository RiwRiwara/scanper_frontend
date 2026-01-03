"use client";

import { type UserData } from "../lib/api";

interface UsageCardProps {
  userData: UserData;
}

export default function UsageCard({ userData }: UsageCardProps) {
  const usagePercent = Math.round(
    (userData.ocr_count_session / userData.ocr_limit) * 100
  );

  const getProgressColor = () => {
    if (usagePercent >= 90) return "bg-red-500";
    if (usagePercent >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Usage Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">
          OCR Usage This Session
        </h2>

        {/* Progress Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * usagePercent) / 100}
                strokeLinecap="round"
                className={`${getProgressColor()} transition-all duration-500`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">
                {userData.ocr_count_session}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                / {userData.ocr_limit}
              </span>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {userData.ocr_remaining}
          </span>
          <span className="text-slate-500 dark:text-slate-400 ml-2">
            pages remaining
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {usagePercent}% used
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {userData.ocr_count_total}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total pages (all time)
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {userData.message_count}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Total messages
          </div>
        </div>
      </div>

      {/* Activity Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Activity
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">First seen</span>
            <span className="text-slate-700 dark:text-slate-200">
              {formatDate(userData.first_seen_at)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Last active</span>
            <span className="text-slate-700 dark:text-slate-200">
              {formatDate(userData.last_seen_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
