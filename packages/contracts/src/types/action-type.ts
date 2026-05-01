import { ZodSchema, z } from "zod";

type Action = {
  params?: ZodSchema;
  payload?: ZodSchema;
  query?: ZodSchema;
  validations?: Record<string, ZodSchema>;
  response: {
    ok: ZodSchema;
  };
};

type ResponseInferred<T extends Pick<Action, "response">> = {
  ok: z.infer<T["response"]["ok"]>;
};

type ActionInferred<T extends Action> = (T["params"] extends undefined
  ? { params?: never }
  : { params: z.infer<NonNullable<T["params"]>> }) &
  (T["query"] extends undefined
    ? { query?: never }
    : { query: z.infer<NonNullable<T["query"]>> }) &
  (T["payload"] extends undefined
    ? { payload?: never }
    : { payload: z.infer<NonNullable<T["payload"]>> }) &
  (T["validations"] extends undefined
    ? { validations?: never }
    : {
        validations: {
          [K in keyof NonNullable<T["validations"]>]: z.infer<
            NonNullable<T["validations"]>[K]
          >;
        };
      }) & {
    response: ResponseInferred<T>;
  };

export type Actions<T extends Record<string, Action>> = {
  [K in keyof T]: ActionInferred<T[K]>;
};

export type Events<T extends Record<string, ZodSchema>> = {
  [K in keyof T]: z.infer<T[K]>;
};
