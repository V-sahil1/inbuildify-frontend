import Head from "next/head";
import "../styles/globals.css";
import "../styles/contacts-form.css";
import "../styles/ag-theme-custom.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import AuthLayout from "../components/layout/AuthLayout";
import { Provider } from "react-redux";
import { store } from "../redux/feature/store";
import { ConfigProvider } from "antd";
import theme from "../antd.config";
import AuthValidator from "@/components/common/AuthValidator";
import Loading from "@/components/common/Loading";

export default function App({ Component, pageProps }) {
  const { isAuthRoute } = pageProps;
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false);

  const pageUrl = router.pathname;

  useEffect(() => {
    // Simulate app initialization (you can add actual initialization logic here)
    const initializeApp = () => {
      // Add any app-level initialization logic here
      // For example: theme setup, global configurations, etc.

      setTimeout(() => {
        setIsAppReady(true);
      }, 100); // Minimal delay to prevent flash
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!isAppReady) return;

    const pageClass = pageUrl.substring(1).replace(/\//g, "-");
    document.body.classList.add(pageClass ? pageClass : "dashboard");

    return () => {
      document.body.classList.remove(pageClass ? pageClass : "dashboard");
    };
  }, [pageUrl, isAppReady]);

  // Show app loading screen until ready
  if (!isAppReady) {
    return (
      <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>InBuildify</title>
        </Head>
        <Loading />
      </>
    );
  }

  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>InBuildify</title>
        </Head>
        <AuthValidator>
          {isAuthRoute ? (
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
    </Provider>
  );
}
