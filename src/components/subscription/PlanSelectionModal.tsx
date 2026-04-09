"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore";
import { ROUTES } from "@/lib/constants";

interface PlanSelectionModalProps {
  isOpen: boolean;
  /** Called after successful plan selection */
  onSuccess?: () => void;
}

const PLANS = [
  {
    slug: "free",
    name: "Bản Dùng Thử",
    englishName: "Free Trial",
    price: "Miễn phí",
    billingNote: "7 ngày miễn phí, không cần thẻ tín dụng",
    trialDays: 7,
    color: "from-indigo-500 to-purple-600",
    features: [
      "Truy cập toàn bộ khóa học",
      "Bàn phím piano ảo tương tác",
      "Theo dõi tiến trình học tập",
      "Bài tập và câu hỏi kiểm tra",
      "Hỗ trợ cộng đồng học viên",
    ],
    cta: "Bắt đầu dùng thử miễn phí",
    badge: "7 NGÀY MIỄN PHÍ",
  },
];

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onSuccess,
}) => {
  const router = useRouter();
  const { selectPlan, isLoading, error } = useSubscriptionStore();
  const [selectedSlug, setSelectedSlug] = useState<string>("free");

  if (!isOpen) return null;

  const handleSelectPlan = async (planSlug: string) => {
    setSelectedSlug(planSlug);
    try {
      await selectPlan(planSlug);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch {
      // Error is shown via store state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <span className="text-4xl">🎹</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Chào mừng đến CoursUE!</h2>
          <p className="text-indigo-100 text-sm">
            Chọn gói để bắt đầu hành trình học piano của bạn
          </p>
        </div>

        {/* Plans */}
        <div className="px-8 py-6 space-y-4">
          {PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
                selectedSlug === plan.slug
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
              onClick={() => setSelectedSlug(plan.slug)}
            >
              {/* Badge */}
              <span className="absolute -top-3 left-4 px-3 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full shadow">
                {plan.badge}
              </span>

              <div className="flex items-start justify-between mt-1">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.englishName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{plan.price}</p>
                  <p className="text-xs text-gray-400">{plan.billingNote}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
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
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => handleSelectPlan(selectedSlug)}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Đang xử lý...
              </>
            ) : (
              <>
                <span>🚀</span>
                {PLANS.find((p) => p.slug === selectedSlug)?.cta ?? "Bắt đầu"}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Không cần thẻ tín dụng · Huỷ bất kỳ lúc nào
          </p>
        </div>
      </div>
    </div>
  );
};

