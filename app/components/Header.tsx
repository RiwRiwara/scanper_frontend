"use client";

import { useState } from "react";
import { type LiffProfile } from "../lib/liff";
import { type UserData } from "../lib/api";

interface HeaderProps {
  profile: LiffProfile | null;
  userData: UserData | null;
  onLogout: () => void;
  onUpdateDisplayName: (newName: string) => Promise<{ success: boolean; error: string | null }>;
  isUpdating: boolean;
}

export default function Header({ profile, userData, onLogout, onUpdateDisplayName, isUpdating }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // Use custom display name from userData if available, otherwise LINE profile name
  const displayName = userData?.display_name || profile?.displayName || "User";

  const handleEditClick = () => {
    setEditName(displayName);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }

    if (editName.trim().length > 50) {
      setEditError("Name cannot exceed 50 characters");
      return;
    }

    const result = await onUpdateDisplayName(editName.trim());

    if (result.success) {
      setIsEditing(false);
      setEditError(null);
    } else {
      setEditError(result.error || "Failed to update");
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile?.pictureUrl && (
            <img
              src={profile.pictureUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-32 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    maxLength={50}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                      if (e.key === "Escape") handleCancel();
                    }}
                  />
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {editError && (
                  <p className="text-xs text-red-500">{editError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-slate-800 dark:text-white">
                  {displayName}
                </h1>
                {userData && (
                  <button
                    onClick={handleEditClick}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title="Edit display name"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>
            )}
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
