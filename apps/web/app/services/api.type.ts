export interface RequestParams<T, J> {
  payload?: T;
  params?: J;
}

export type ERD<T> = {
  status: number;
  data: T;
};
