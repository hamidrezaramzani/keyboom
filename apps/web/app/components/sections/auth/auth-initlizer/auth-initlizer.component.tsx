"use client";

import { useGetMeQuery } from "@/app/services";

export const AuthInitializer = () => {
  const { isLoading } = useGetMeQuery();

  if (isLoading) return null;

  return null;
};
