import { TicketActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { ERD, QueryArgsNew } from "../api.type";
import { TICKET_ENDPOINTS } from "./api-ticket.constant";
import { transformResponse } from "../api.helper";

export const ticketEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<
      ERD<TicketActions["create"]>,
      QueryArgsNew<TicketActions["create"]>
    >({
      query: ({ payload }) => ({
        url: TICKET_ENDPOINTS.create,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Ticket"],
    }),
    getTickets: builder.query<
      ERD<TicketActions["readMany"]>,
      QueryArgsNew<TicketActions["readMany"]>
    >({
      query: ({ query }) => ({
        url: TICKET_ENDPOINTS.readMany,
        method: "GET",
        params: query,
      }),
      providesTags: ["Ticket"],
      transformResponse,
    }),
    getTicket: builder.query<
      ERD<TicketActions["readOne"]>,
      QueryArgsNew<TicketActions["readOne"]>
    >({
      query: ({ params }) => ({
        url: TICKET_ENDPOINTS.readOne(params.ticketId),
        method: "GET",
      }),
      providesTags: ["Ticket"],
      transformResponse,
    }),
    addTicketMessage: builder.mutation<
      ERD<TicketActions["addMessage"]>,
      QueryArgsNew<TicketActions["addMessage"]>
    >({
      query: ({ params, payload }) => ({
        url: TICKET_ENDPOINTS.addMessage(params.ticketId),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Ticket"],
    }),
    closeTicket: builder.mutation<
      ERD<TicketActions["close"]>,
      QueryArgsNew<TicketActions["close"]>
    >({
      query: ({ params }) => ({
        url: TICKET_ENDPOINTS.close(params.ticketId),
        method: "PUT",
      }),
      invalidatesTags: ["Ticket"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateTicketMutation,
  useGetTicketsQuery,
  useGetTicketQuery,
  useAddTicketMessageMutation,
  useCloseTicketMutation,
} = ticketEndpoints;
