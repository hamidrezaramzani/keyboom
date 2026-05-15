export const SUBSCRIPTION_ENDPOINTS = {
  create: "/subscriptions",
  update: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  move: (subscriptionId: string) => `/subscriptions/${subscriptionId}/move`,
  delete: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  renew: (subscriptionId: string) => `/subscriptions/${subscriptionId}/renew`,
  cancel: (subscriptionId: string) => `/subscriptions/${subscriptionId}/cancel`,
  stats: (subscriptionId: string) => `/subscriptions/${subscriptionId}/stats`,
  timeline: (subscriptionId: string) =>
    `/subscriptions/${subscriptionId}/timeline`,
};
