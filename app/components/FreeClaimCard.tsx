"use client";

import { useState, useEffect } from "react";
import { type FreeClaimStatus, getFreeClaimStatus, claimFreePages } from "../lib/api";
import { getAccessToken } from "../lib/liff";

interface FreeClaimCardProps {
  onClaimed: () => void;
}

export default function FreeClaimCard({ onClaimed }: FreeClaimCardProps) {
  const [status, setStatus] = useState<FreeClaimStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await getFreeClaimStatus(accessToken);
    setIsLoading(false);

    if (data) {
      setStatus(data);
    }
    if (error) {
      setError(error);
    }
  };

  const handleClaim = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    setIsClaiming(true);
    setError(null);
    setSuccessMessage(null);

    const { data, error } = await claimFreePages(accessToken);
    setIsClaiming(false);

    if (data) {
      setSuccessMessage(data.message);
      setStatus({
        can_claim: false,
        pages_available: 0,
        last_claimed: new Date().toISOString(),
        next_claim_at: data.can_claim_again_at,
      });
      onClaimed();
    }
    if (error) {
      setError(error);
    }
  };

  const formatNextClaimTime = (isoString: string | null) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-amber-700 dark:text-amber-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎁</span>
          </div>
          <div>
            <h3 className="font-bold text-amber-800 dark:text-amber-200">
              Daily Free Pages
            </h3>
            {status.can_claim ? (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Claim {status.pages_available} free pages today!
              </p>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Next claim: {formatNextClaimTime(status.next_claim_at) || "Tomorrow"} (00:00)
              </p>
            )}
          </div>
        </div>

        {status.can_claim && (
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            {isClaiming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <span>🎉</span>
                Claim
              </>
            )}
          </button>
        )}

        {!status.can_claim && (
          <div className="px-4 py-2 bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 font-medium rounded-xl">
            ✓ Claimed
          </div>
        )}
      </div>

      {successMessage && (
        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-green-700 dark:text-green-300 text-sm font-medium">
            🎉 {successMessage}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
