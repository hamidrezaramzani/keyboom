
export type BaseQueryFuncOptions = {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  gateway?: "porosys" | "cartable";
  payload?: unknown;
  responseType?: "json" | "blob" | "arraybuffer";
};

export type Response = {
  data: unknown;
};

export type RefreshTokenResponse = {
  refresh: string;
  token: string;
};

type ActionData = {
  params?: unknown;
  query?: unknown;
  payload?: unknown;
};

type ActionResponse = {
  response: {
    ok: {
      data: unknown;
    };
  };
};

export type ERD<T extends ActionResponse> = T["response"]["ok"]["data"];

export type QueryArgsNew<T extends ActionData> = (undefined extends T["params"]
  ? { params?: never }
  : { params: T["params"] }) &
  (undefined extends T["query"] ? { query?: never } : { query: T["query"] }) &
  (undefined extends T["payload"]
    ? { payload?: never }
    : { payload: T["payload"] });
