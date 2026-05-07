import { CategoryActions } from "@keyboom/contracts/client";
import { baseApi } from "../api";
import { QueryArgsNew } from "../api.type";
import { CATEGORY_ENDPOINTS } from "./api-category.constant";
import { ERD } from "../api.type";
import { transformResponse } from "../api.helper";

export const categoryEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    readManyCategories: builder.query<
      ERD<CategoryActions["readMany"]>,
      QueryArgsNew<CategoryActions["readMany"]>
    >({
      query: () => ({
        url: CATEGORY_ENDPOINTS.readMany,
        method: "GET",
      }),
      transformResponse,
    }),
  }),
  overrideExisting: true,
});

export const { useReadManyCategoriesQuery } = categoryEndpoints;
