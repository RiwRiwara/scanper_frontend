"use client";

import { useState, useEffect } from "react";
import { getPaymentHistory, type PaymentHistoryItem } from "../lib/api";
import { getAccessToken } from "../lib/liff";

interface PaymentHistoryProps {
  refreshTrigger?: number;
}

export default function PaymentHistory({ refreshTrigger }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      setIsLoading(true);
      const { data, error: apiError } = await getPaymentHistory(accessToken);

      if (apiError) {
        setError(apiError);
      } else if (data) {
        setPayments(data);
      }
      setIsLoading(false);
    }

    loadHistory();
  }, [refreshTrigger]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
            Success
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    if (method === "CARD") {
      return (
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
    );
  };

  // Calculate totals
  const successfulPayments = payments.filter((p) => p.status === "SUCCEEDED");
  const totalSpent = successfulPayments.reduce((sum, p) => sum + p.amount_thb, 0);
  const totalPages = successfulPayments.reduce((sum, p) => sum + p.pages_purchased, 0);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Payment History</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Payment History</h3>
        </div>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Payment History</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
          No payment history yet
        </p>
      </div>
    );
  }

  const displayPayments = isExpanded ? payments : payments.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Payment History</h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {payments.length} transaction{payments.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Summary */}
        {successfulPayments.length > 0 && (
          <div className="flex gap-4 mt-3">
            <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                ฿{totalSpent.toLocaleString()}
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70">total spent</div>
            </div>
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {totalPages.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70">pages bought</div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions list */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {displayPayments.map((payment) => (
          <div key={payment.charge_id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-3">
              {getPaymentMethodIcon(payment.payment_method)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800 dark:text-white">
                    +{payment.pages_purchased} pages
                  </span>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatDate(payment.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800 dark:text-white">
                  ฿{payment.amount_thb.toLocaleString()}
                </div>
                {payment.payment_method && (
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {payment.payment_method}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more/less button */}
      {payments.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 text-sm text-green-600 dark:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors font-medium"
        >
          {isExpanded ? "Show less" : `Show all ${payments.length} transactions`}
        </button>
      )}
    </div>
  );
}
