"use client";

import { type LiffProfile } from "../lib/liff";

interface HeaderProps {
  profile: LiffProfile | null;
  onLogout: () => void;
}

export default function Header({ profile, onLogout }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile?.pictureUrl && (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h1 className="font-semibold text-slate-800 dark:text-white">
              {profile?.displayName || "User"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">ScanPer</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
