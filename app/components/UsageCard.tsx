"use client";

import { type UserData } from "../lib/api";

interface UsageCardProps {
  userData: UserData;
  onBuyMore: () => void;
}

export default function UsageCard({ userData, onBuyMore }: UsageCardProps) {
  const usagePercent = Math.round(
    (userData.ocr_count_session / userData.ocr_limit) * 100
  );

  const getProgressColor = () => {
    if (usagePercent >= 90) return "text-red-500";
    if (usagePercent >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressBgColor = () => {
    if (usagePercent >= 90) return "bg-red-500";
    if (usagePercent >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRemainingStatus = () => {
    if (userData.ocr_remaining <= 0) {
      return { label: "No pages left", color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-900/30" };
    }
    if (userData.ocr_remaining <= 5) {
      return { label: "Almost out!", color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-900/30" };
    }
    if (userData.ocr_remaining <= 10) {
      return { label: "Running low", color: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" };
    }
    return { label: "Good", color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-900/30" };
  };

  const remainingStatus = getRemainingStatus();

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
      {/* Main Remaining Pages Card */}
      <div className={`rounded-2xl shadow-lg p-6 ${remainingStatus.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
            Pages Remaining
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${remainingStatus.color} ${remainingStatus.bgColor}`}>
            {remainingStatus.label}
          </span>
        </div>

        {/* Big remaining number */}
        <div className="text-center mb-6">
          <div className={`text-7xl font-bold ${remainingStatus.color}`}>
            {userData.ocr_remaining}
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-lg mt-1">
            of {userData.ocr_limit} pages
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full ${getProgressBgColor()} transition-all duration-500`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{userData.ocr_count_session} used</span>
            <span>{usagePercent}%</span>
          </div>
        </div>

        {/* Buy more button */}
        <button
          onClick={onBuyMore}
          className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Buy More Pages
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Total Pages</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {userData.ocr_count_total.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">all time</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Messages</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {userData.message_count.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">sent to bot</div>
        </div>
      </div>

      {/* Activity Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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

      {/* Pricing info */}
      <div className="text-center text-sm text-slate-400 dark:text-slate-500">
        10 THB = 20 pages
      </div>
    </div>
  );
}
