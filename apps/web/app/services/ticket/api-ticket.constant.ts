export const TICKET_ENDPOINTS = {
  create: "/tickets",
  readMany: "/tickets",
  readOne: (ticketId: string) => `/tickets/${ticketId}`,
  addMessage: (ticketId: string) => `/tickets/${ticketId}/messages`,
  close: (ticketId: string) => `/tickets/${ticketId}/close`,
};
