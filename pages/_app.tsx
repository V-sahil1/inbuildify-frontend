import Head from 'next/head';
import '../styles/globals.css';
import '../styles/contacts-form.css';
import '../styles/ag-theme-custom.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import AuthLayout from '../components/layout/AuthLayout';
import { Provider } from 'react-redux';
import { store } from '../redux/feature/store';
import { ConfigProvider } from 'antd';
import theme from '../antd.config';
import AuthValidator from '@/components/common/AuthValidator';
import PageLoading from '@/components/common/PageLoading';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import SystemRoutes from '@lib/constants/Routes';

export default function App({ Component, pageProps }) {
  const { isAuthRoute } = pageProps;
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeLoaderKey, setRouteLoaderKey] = useState(0);
  const routeLoaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pageUrl = router.pathname;

  useEffect(() => {
    const initializeApp = () => {
      setTimeout(() => {
        setIsAppReady(true);
      }, 500);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!isAppReady) return;

    const pageClass = pageUrl.substring(1).replace(/\//g, '-');
    document.body.classList.add(pageClass ? pageClass : 'dashboard');

    return () => {
      document.body.classList.remove(pageClass ? pageClass : 'dashboard');
    };
  }, [pageUrl, isAppReady]);

  useEffect(() => {
    if (!isAppReady) return;

    const handleRouteChangeStart = () => {
      if (routeLoaderTimeoutRef.current) {
        clearTimeout(routeLoaderTimeoutRef.current);
      }

      // Delay a bit to avoid flashing the loader on ultra-fast navigations.
      routeLoaderTimeoutRef.current = setTimeout(() => {
        setRouteLoaderKey(prev => prev + 1);
        setIsRouteLoading(true);
      }, 150);
    };

    const handleRouteDone = () => {
      if (routeLoaderTimeoutRef.current) {
        clearTimeout(routeLoaderTimeoutRef.current);
      }
      setIsRouteLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteDone);
    router.events.on('routeChangeError', handleRouteDone);

    return () => {
      if (routeLoaderTimeoutRef.current) {
        clearTimeout(routeLoaderTimeoutRef.current);
      }
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteDone);
      router.events.off('routeChangeError', handleRouteDone);
    };
  }, [isAppReady, router.events]);

  if (!isAppReady) {
    return (
      <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>InBuildify</title>
        </Head>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent backdrop-blur-md">
          <PageLoading />
        </div>
      </>
    );
  }

  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <ConfigProvider theme={theme}>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>InBuildify</title>
          </Head>
          <AuthValidator>
            {isRouteLoading && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent backdrop-blur-md">
                <PageLoading key={routeLoaderKey} type="primary" />
              </div>
            )}
            {/* Special handling for approval page - no layout, no auth required */}
                         {/* {[SystemRoutes.APPROVAL, SystemRoutes.SIGN_COMPLETE, SystemRoutes.SIGNING_ERROR].includes(pageUrl) ? ( */}
            {pageUrl === '/approve' || pageUrl.startsWith('/external') ? (
              <Component {...pageProps} />
            ) : isAuthRoute ? (
              <AuthLayout>
                <Component {...pageProps} />
              </AuthLayout>
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </AuthValidator>
        </ConfigProvider>
      </ThemeContextProvider>
    </Provider>
  );
}
