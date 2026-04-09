"use client";

import React, { useEffect } from "react";
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore";
import { TrialExpiredModal } from "./TrialExpiredModal";

/**
 * SubscriptionGuard – listens for 403 subscription errors dispatched by the
 * API client and shows the appropriate modal.  Should be rendered once inside
 * the authenticated layout.
 */
export const SubscriptionGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setTrialExpiredModal, setNoSubscriptionModal } =
    useSubscriptionStore();

  useEffect(() => {
    const handleSubscriptionError = (e: Event) => {
      const code = (e as CustomEvent<{ code: string }>).detail?.code;
      if (code === "TRIAL_EXPIRED") {
        setTrialExpiredModal(true);
      } else if (code === "NO_SUBSCRIPTION") {
        setNoSubscriptionModal(true);
      }
    };

    window.addEventListener("subscription-error", handleSubscriptionError);
    return () =>
      window.removeEventListener("subscription-error", handleSubscriptionError);
  }, [setTrialExpiredModal, setNoSubscriptionModal]);

  return (
    <>
      {children}
      <TrialExpiredModal />
    </>
  );
};

