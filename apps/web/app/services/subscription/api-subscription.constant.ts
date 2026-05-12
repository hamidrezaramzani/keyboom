export const SUBSCRIPTION_ENDPOINTS = {
  create: "/subscriptions",
  update: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  move: (subscriptionId: string) => `/subscriptions/${subscriptionId}/move`,
  delete: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  renew: (subscriptionId: string) => `/subscriptions/${subscriptionId}/renew`,
};
