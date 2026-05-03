"use client";

import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/app/services";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";

export const AuthInitializer = () => {
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ["/login", "/register", "/", "/about", "/contact"];
  const isPublicRoute = publicRoutes.includes(pathname);

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: _user,
    isLoading,
    isError,
  } = useGetMeQuery(isPublicRoute ? skipToken : undefined);

  useEffect(() => {
    if (!isLoading && !isPublicRoute && isError) {
      router.push("/login");
    }
  }, [isLoading, isPublicRoute, isError, router]);

  if (isLoading) return null;

  return null;
};
