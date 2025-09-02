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
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

  function normalizePath(path: string) {
    if (path === "/") return path;
    return path?.replace(/\/+$/, "");
  }
  const normalizedPath = normalizePath(pathname);
  const isPublicRoute = publicRoutes.includes(normalizedPath);

  useEffect(() => {
    // Clear any existing timeout
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
    }

    async function validateAuth() {
      setAuthState('checking');
      
      const token = getStoredAuthToken();
      const refreshToken = getRefreshToken();

      // If no tokens and trying to access protected route
      if (!token || !refreshToken) {
        if (!isPublicRoute) {
          setAuthState('redirecting');
          // Small delay to show redirecting state
          const timeout = setTimeout(() => {
            router.replace(`${SystemRoutes.LOGIN}?redirectTo=${normalizedPath}`);
          }, 300);
          setRedirectTimeout(timeout);
        } else {
          setAuthState('unauthenticated');
        }
        return;
      }

      // If has tokens, validate them
      try {
        await dispatch(getUserThunk()).unwrap();
        
        if (isAuthenticated && isPublicRoute) {
          setAuthState('redirecting');
          const timeout = setTimeout(() => {
            router.replace("/");
          }, 300);
          setRedirectTimeout(timeout);
        } else {
          setAuthState('authenticated');
        }
      } catch (error) {
        setAuthState('redirecting');
        const timeout = setTimeout(() => {
          router.replace(`${SystemRoutes.LOGIN}?redirectTo=${normalizedPath}`);
        }, 300);
        setRedirectTimeout(timeout);
      }
    }

    validateAuth();

    // Cleanup timeout on unmount
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
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