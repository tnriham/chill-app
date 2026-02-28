import { getSubscription } from "../data/subscription.js";

export function isPremiumUser() {
  const sub = getSubscription();
  return !!sub?.isSubscribed;
}
