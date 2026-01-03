"use client";

import { useLiff } from "./context/LiffContext";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import UsageCard from "./components/UsageCard";
import NotFoundCard from "./components/NotFoundCard";

export default function Home() {
  const {
    isInitialized,
    isLoggedIn,
    profile,
    userData,
    userNotFound,
    error,
    isLoading,
    login,
    logout,
    refreshUserData,
  } = useLiff();

  // Loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            Initialization Error
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={login} />;
  }

  // Logged in - show dashboard
  return (
    <div className="min-h-screen pb-6">
      <Header profile={profile} onLogout={logout} />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Error banner */}
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              {error}
            </p>
            <button
              onClick={refreshUserData}
              className="mt-2 text-yellow-600 dark:text-yellow-400 text-sm underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* User data */}
        {userData && <UsageCard userData={userData} />}

        {/* User not found */}
        {userNotFound && <NotFoundCard userNotFound={userNotFound} />}

        {/* Refresh button */}
        <button
          onClick={refreshUserData}
          disabled={isLoading}
          className="w-full mt-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </main>
    </div>
  );
}
