import apiClient from "./client";

export interface SubscriptionStatus {
  status: "trialing" | "expired" | "active" | null;
  trialDaysLeft: number;
  trialEndDate?: string;
  message?: string;
}

export interface SelectPlanResponse {
  status: "trialing";
  trialEndDate: string;
  trialDaysLeft: number;
}

export const subscriptionApi = {
  /**
   * Select a subscription plan after registration / first login
   */
  selectPlan: async (planSlug: string): Promise<SelectPlanResponse> => {
    const response = await apiClient.post<SelectPlanResponse>(
      "/subscription/select-plan",
      { planSlug },
    );
    return response.data;
  },

  /**
   * Get current user's subscription status
   */
  getMySubscription: async (): Promise<SubscriptionStatus> => {
    const response = await apiClient.get<SubscriptionStatus>(
      "/subscription/my-subscription",
    );
    return response.data;
  },
};

