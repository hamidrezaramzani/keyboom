export const SUBSCRIPTION_PERIOD_ENDPOINTS = {
  create: (subscriptionId: string) =>
    `/subscriptions/${subscriptionId}/periods`,
  readMany: (subscriptionId: string) =>
    `/subscriptions/${subscriptionId}/periods`,
  update: (subscriptionId: string, periodId: string) =>
    `/subscriptions/${subscriptionId}/periods/${periodId}`,
  delete: (subscriptionId: string, periodId: string) =>
    `/subscriptions/${subscriptionId}/periods/${periodId}`,
};
