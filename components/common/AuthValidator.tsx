import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getRefreshToken, getStoredAuthToken } from "@lib/constants/authToken";
import { getUserThunk } from "@redux/feature/auth/authThunk";
import SystemRoutes from "@lib/constants/Routes";

const publicRoutes = [SystemRoutes.LOGIN, SystemRoutes.SIGNUP,SystemRoutes.FORGOT_PASSWORD,SystemRoutes.RESET_PASSWORD,SystemRoutes.TWO_FACTOR_AUTH,SystemRoutes.INVITE];  

export default function AuthValidator({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  function normalizePath(path: string) {
    if (path === "/") return path;
    return path.replace(/\/+$/, ""); // remove trailing slashes
  }
  const normalizedPath = normalizePath(pathname);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateAuth() {
      const token = getStoredAuthToken();
      const refreshToken = getRefreshToken();

      if (token && refreshToken) {
        try {
          await dispatch(getUserThunk()).unwrap();

          if (isAuthenticated && publicRoutes.includes(normalizedPath)) {
            router.replace("/");
          }
        } catch (error) {
          router.replace(`${SystemRoutes.LOGIN}?redirectTo=${normalizedPath}`);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        if (!publicRoutes.includes(normalizedPath)) {
          router.replace(`${SystemRoutes.LOGIN}?redirectTo=${normalizedPath}`);
        }
      }
    }
    validateAuth();
  }, [dispatch, router, pathname]);

  if (loading) return null;

  return children;
}

