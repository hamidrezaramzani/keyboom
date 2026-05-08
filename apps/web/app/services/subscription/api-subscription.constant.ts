export const SUBSCRIPTION_ENDPOINTS = {
  create: "/subscriptions",
  update: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  move: (subscriptionId: string) => `/subscriptions/${subscriptionId}/move`,
  archive: (subscriptionId: string) =>
    `/subscriptions/${subscriptionId}/archive`,
  restore: (subscriptionId: string) =>
    `/subscriptions/${subscriptionId}/restore`,
  delete: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
};
