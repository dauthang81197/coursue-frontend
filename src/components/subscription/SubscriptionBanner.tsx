"use client";

import React from "react";
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore";

export const SubscriptionBanner: React.FC = () => {
  const { status, trialDaysLeft } = useSubscriptionStore();

  if (!status || status === "active") return null;

  if (status === "trialing" && trialDaysLeft !== null) {
    const isUrgent = trialDaysLeft <= 2;
    const bgColor = isUrgent
      ? "bg-orange-50 border-orange-300"
      : "bg-indigo-50 border-indigo-200";
    const textColor = isUrgent ? "text-orange-800" : "text-indigo-800";
    const iconColor = isUrgent ? "text-orange-500" : "text-indigo-500";

    return (
      <div
        className={`flex items-center justify-between px-4 py-2.5 border rounded-lg mb-4 ${bgColor}`}
      >
        <div className={`flex items-center gap-2 text-sm font-medium ${textColor}`}>
          <svg
            className={`w-4 h-4 flex-shrink-0 ${iconColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {isUrgent ? (
            <span>
              ⚠️ Chỉ còn{" "}
              <strong>
                {trialDaysLeft} ngày{trialDaysLeft !== 1 ? "" : ""}
              </strong>{" "}
              trong bản dùng thử của bạn!
            </span>
          ) : (
            <span>
              🎁 Bạn đang dùng bản dùng thử —{" "}
              <strong>còn {trialDaysLeft} ngày</strong> miễn phí
            </span>
          )}
        </div>
        <button className="ml-4 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap">
          Nâng cấp ngay
        </button>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 border border-red-300 bg-red-50 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-red-800">
          <svg
            className="w-4 h-4 flex-shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.072 16.5C2.302 18.333 3.264 20 4.804 20z"
            />
          </svg>
          <span>
            🔒 Bản dùng thử đã hết hạn. Vui lòng nâng cấp để tiếp tục học.
          </span>
        </div>
        <button className="ml-4 px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap">
          Gia hạn ngay
        </button>
      </div>
    );
  }

  return null;
};

