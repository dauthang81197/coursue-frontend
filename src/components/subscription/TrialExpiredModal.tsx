"use client";

import React from "react";
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore";

interface TrialExpiredModalProps {
  /** "TRIAL_EXPIRED" | "NO_SUBSCRIPTION" */
  code?: string;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ code }) => {
  const { showTrialExpiredModal, showNoSubscriptionModal, setTrialExpiredModal, setNoSubscriptionModal } =
    useSubscriptionStore();

  const isVisible = showTrialExpiredModal || showNoSubscriptionModal;
  if (!isVisible) return null;

  const isExpired = showTrialExpiredModal || code === "TRIAL_EXPIRED";

  const handleClose = () => {
    setTrialExpiredModal(false);
    setNoSubscriptionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div
          className={`px-8 py-6 text-white text-center ${
            isExpired
              ? "bg-gradient-to-r from-red-500 to-orange-500"
              : "bg-gradient-to-r from-gray-600 to-gray-800"
          }`}
        >
          <div className="text-5xl mb-3">{isExpired ? "⏰" : "🔒"}</div>
          <h2 className="text-xl font-bold mb-1">
            {isExpired ? "Bản dùng thử đã hết hạn" : "Bạn chưa có gói đăng ký"}
          </h2>
          <p className={`text-sm ${isExpired ? "text-red-100" : "text-gray-300"}`}>
            {isExpired
              ? "7 ngày dùng thử miễn phí của bạn đã kết thúc"
              : "Vui lòng chọn gói để truy cập nội dung này"}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-gray-600 text-sm text-center mb-6">
            {isExpired
              ? "Nâng cấp lên Premium để tiếp tục truy cập toàn bộ khóa học và tính năng học piano tương tác không giới hạn."
              : "Chọn gói phù hợp để bắt đầu hành trình học piano của bạn ngay hôm nay."}
          </p>

          {/* Benefits */}
          <ul className="space-y-2 mb-6">
            {[
              "Truy cập không giới hạn tất cả khóa học",
              "Bàn phím piano ảo tương tác",
              "Bài tập và kiểm tra chuyên sâu",
              "Theo dõi tiến trình chi tiết",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <button className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
            🚀 Nâng cấp Premium
          </button>

          <button
            onClick={handleClose}
            className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
};

