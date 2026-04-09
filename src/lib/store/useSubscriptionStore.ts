import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscriptionApi } from "../api/subscription";

type SubscriptionStatusValue = "trialing" | "expired" | "active" | null;

interface SubscriptionState {
  // State
  status: SubscriptionStatusValue;
  trialDaysLeft: number | null;
  trialEndDate: string | null;
  isLoading: boolean;
  error: string | null;
  // Modal flags (not persisted)
  showTrialExpiredModal: boolean;
  showNoSubscriptionModal: boolean;

  // Actions
  fetchSubscription: () => Promise<void>;
  selectPlan: (planSlug: string) => Promise<void>;
  setTrialExpiredModal: (show: boolean) => void;
  setNoSubscriptionModal: (show: boolean) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      status: null,
      trialDaysLeft: null,
      trialEndDate: null,
      isLoading: false,
      error: null,
      showTrialExpiredModal: false,
      showNoSubscriptionModal: false,

      fetchSubscription: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await subscriptionApi.getMySubscription();
          set({
            status: data.status,
            trialDaysLeft: data.trialDaysLeft ?? null,
            trialEndDate: data.trialEndDate ?? null,
            isLoading: false,
          });
        } catch (err) {
          console.error("fetchSubscription error:", err);
          set({ isLoading: false });
        }
      },

      selectPlan: async (planSlug: string) => {
        try {
          set({ isLoading: true, error: null });
          const data = await subscriptionApi.selectPlan(planSlug);
          set({
            status: data.status,
            trialDaysLeft: data.trialDaysLeft,
            trialEndDate: data.trialEndDate,
            isLoading: false,
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to select plan";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      setTrialExpiredModal: (show: boolean) => set({ showTrialExpiredModal: show }),
      setNoSubscriptionModal: (show: boolean) => set({ showNoSubscriptionModal: show }),

      reset: () =>
        set({
          status: null,
          trialDaysLeft: null,
          trialEndDate: null,
          isLoading: false,
          error: null,
          showTrialExpiredModal: false,
          showNoSubscriptionModal: false,
        }),
    }),
    {
      name: "subscription-storage",
      partialize: (state) => ({
        status: state.status,
        trialDaysLeft: state.trialDaysLeft,
        trialEndDate: state.trialEndDate,
      }),
    },
  ),
);

