import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "./Loading";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getRefreshToken, getStoredAuthToken } from "@lib/constants/authToken";
import { getUserThunk } from "@redux/feature/auth/authThunk";
import SystemRoutes from "@lib/constants/Routes";

const publicRoutes = [
  SystemRoutes.LOGIN,
  SystemRoutes.SIGNUP,
  SystemRoutes.FORGOT_PASSWORD,
  SystemRoutes.RESET_PASSWORD,
  SystemRoutes.TWO_FACTOR_AUTH,
  SystemRoutes.INVITE,
];

type AuthState = 'checking' | 'authenticated' | 'unauthenticated' | 'redirecting';

// ✅ Utility to normalize paths (remove trailing slash, keep root "/")
function normalizePath(path: string) {
  return path === "/" ? "/" : path?.replace(/\/+$/, "");
}

export default function AuthValidator({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const [authState, setAuthState] = useState<AuthState>('checking');

  function normalizePath(path: string) {
    if (path === "/") return path;
    return path?.replace(/\/+$/, "");
  }
  const normalizedPath = normalizePath(pathname);
  const isPublicRoute = publicRoutes.includes(normalizedPath);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    async function validateAuth() {
      setAuthState("checking");
  
      const token = getStoredAuthToken();
      const refreshToken = getRefreshToken();
  
      if (!token || !refreshToken) {
        if (!isPublicRoute) {
          setAuthState("redirecting");
          timeoutId = setTimeout(() => {
            router.replace(`${SystemRoutes.LOGIN}?redirectTo=${normalizedPath}`);
          }, 300);
        } else {
          setAuthState("unauthenticated");
        }
        return;
      }
  
      try {
        await Promise.race([
          dispatch(getUserThunk()).unwrap(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Auth timeout")), 10000)
          ),
        ]);
  
        if (isPublicRoute && isAuthenticated) {
          setAuthState("redirecting");
          timeoutId = setTimeout(() => router.replace("/"), 300);
        } else {
          setAuthState("authenticated");
        }
      } catch {
        setAuthState("unauthenticated");
        timeoutId = setTimeout(() => {
          router.replace(`${SystemRoutes.LOGIN}?redirectTo=${normalizedPath}`);
        }, 300);
      }
    }
  
    validateAuth();
  
    return () => clearTimeout(timeoutId);
  }, [dispatch, router, pathname, isAuthenticated, normalizedPath, isPublicRoute]);
  

  // Show loading screens based on auth state
  if (authState === 'checking' || authState === 'redirecting') {
    return <Loading />;
  }

  // Only render children when auth is properly validated
  if (authState === 'authenticated' || (authState === 'unauthenticated' && isPublicRoute)) {
    return <>{children}</>;
  }

  // Fallback loading state
  return <Loading />;
}