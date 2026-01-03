"use client";

import { useState, useEffect } from "react";
import { useLiff } from "./context/LiffContext";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import UsageCard from "./components/UsageCard";
import NotFoundCard from "./components/NotFoundCard";
import PaymentModal from "./components/PaymentModal";
import PaymentHistory from "./components/PaymentHistory";
import { getPaymentPackages, type PaymentPackage } from "./lib/api";
import { getAccessToken } from "./lib/liff";

export default function Home() {
  const {
    isInitialized,
    isLoggedIn,
    profile,
    userData,
    userNotFound,
    error,
    isLoading,
    isUpdating,
    login,
    logout,
    refreshUserData,
    updateDisplayName,
  } = useLiff();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [packages, setPackages] = useState<PaymentPackage[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  // Check for payment completion from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "complete") {
      setPaymentSuccess(true);
      // Clean up URL
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh user data to get updated quota
      refreshUserData();
      // Refresh payment history
      setHistoryRefreshKey((k) => k + 1);
      // Hide success message after 5 seconds
      setTimeout(() => setPaymentSuccess(false), 5000);
    }
  }, [refreshUserData]);

  // Load payment packages when logged in
  useEffect(() => {
    async function loadPackages() {
      const accessToken = getAccessToken();
      if (accessToken) {
        const { data } = await getPaymentPackages(accessToken);
        if (data) {
          setPackages(data);
        }
      }
    }

    if (isLoggedIn) {
      loadPackages();
    }
  }, [isLoggedIn]);

  const handleBuyMore = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    refreshUserData();
    setHistoryRefreshKey((k) => k + 1);
    setTimeout(() => setPaymentSuccess(false), 5000);
  };

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
      <Header
        profile={profile}
        userData={userData}
        onLogout={logout}
        onUpdateDisplayName={updateDisplayName}
        isUpdating={isUpdating}
      />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Payment success banner */}
        {paymentSuccess && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300 font-medium">
                Payment Successful!
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                Your pages have been added to your account.
              </p>
            </div>
          </div>
        )}

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
        {userData && (
          <>
            <UsageCard userData={userData} onBuyMore={handleBuyMore} />
            {/* Payment History */}
            <div className="mt-4">
              <PaymentHistory refreshTrigger={historyRefreshKey} />
            </div>
          </>
        )}

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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        packages={packages}
      />
    </div>
  );
}
