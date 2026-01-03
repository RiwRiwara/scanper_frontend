"use client";

import { useState } from "react";
import { type PaymentPackage, createCharge } from "../lib/api";
import { getAccessToken } from "../lib/liff";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packages: PaymentPackage[];
}

const MIN_AMOUNT = 10;
const PAGES_PER_10_THB = 20;

export default function PaymentModal({ isOpen, onClose, onSuccess, packages }: PaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCustomPages = () => {
    const amount = parseInt(customAmount) || 0;
    return Math.floor(amount / MIN_AMOUNT) * PAGES_PER_10_THB;
  };

  const getEffectiveAmount = () => {
    if (useCustomAmount) {
      return parseInt(customAmount) || 0;
    }
    return selectedPackage?.amount_thb || 0;
  };

  const getEffectivePages = () => {
    if (useCustomAmount) {
      return getCustomPages();
    }
    return selectedPackage?.pages || 0;
  };

  const handleCustomAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomAmount(numericValue);
    setUseCustomAmount(true);
    setSelectedPackage(null);
  };

  const handlePackageSelect = (pkg: PaymentPackage) => {
    setSelectedPackage(pkg);
    setUseCustomAmount(false);
    setCustomAmount("");
  };

  const handlePurchase = async () => {
    const amount = getEffectiveAmount();

    if (amount < MIN_AMOUNT) {
      setError(`Minimum amount is ${MIN_AMOUNT} THB`);
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      setError("Not authenticated");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { data, error: apiError } = await createCharge(accessToken, amount);

    if (apiError) {
      setError(apiError);
      setIsProcessing(false);
      return;
    }

    if (data) {
      if (data.action_required === "REDIRECT" && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else if (data.action_required === "NONE") {
        onSuccess();
        onClose();
      } else {
        setError("Unsupported payment flow");
        setIsProcessing(false);
      }
    }
  };

  const effectiveAmount = getEffectiveAmount();
  const effectivePages = getEffectivePages();
  const isValid = effectiveAmount >= MIN_AMOUNT;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Buy More Pages
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            10 THB = 20 pages (min 10 THB)
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Custom Amount Input */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Enter custom amount (THB)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">฿</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 text-lg font-bold border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400"
                />
              </div>
              {useCustomAmount && customAmount && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {getCustomPages()}
                  </div>
                  <div className="text-xs text-slate-500">pages</div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-400 dark:text-slate-500">or select package</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Quick Packages */}
          <div className="grid grid-cols-2 gap-3">
            {packages.map((pkg) => (
              <button
                key={pkg.amount_thb}
                onClick={() => handlePackageSelect(pkg)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedPackage?.amount_thb === pkg.amount_thb && !useCustomAmount
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {pkg.pages.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">pages</div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                  ฿{pkg.amount_thb}
                </div>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          {/* Summary */}
          {isValid && (
            <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">You'll receive</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {effectivePages.toLocaleString()} pages
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  ฿{effectiveAmount.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={!isValid || isProcessing}
            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {isValid ? `Pay ฿${effectiveAmount.toLocaleString()}` : "Enter amount (min ฿10)"}
              </>
            )}
          </button>
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
            Secure payment powered by Beam
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
