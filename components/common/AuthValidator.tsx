import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getRefreshToken, getStoredAuthToken } from "@lib/constants/authToken";
import { getUserThunk } from "@redux/feature/auth/authThunk";

export default function AuthValidator({ children }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    async function validateAuth() {
      const token = getStoredAuthToken();
      const refreshToken = getRefreshToken();

      if (token && refreshToken) {
        try {
          setLoading(true);
          await dispatch(getUserThunk()).unwrap();
        } catch (error) {
          router.replace("/login");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        router.replace("/login");
      }
    }
    validateAuth();
  }, [dispatch, router, isClient]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, router]);

  if (!isClient || loading || (!loading && !isAuthenticated)) {
    return null;
  }

  return children;
}
