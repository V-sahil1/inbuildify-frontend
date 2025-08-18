import Head from 'next/head';


import "../styles/globals.css";
import "../styles/ag-theme-custom.css";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import AuthLayout from '../components/layout/AuthLayout';
import { Provider } from 'react-redux';
import { store } from '../redux/feature/store';
import { ConfigProvider } from 'antd';
import theme from '../theme.config';

export default function App({ Component, pageProps }) {

  const { isAuthRoute } = pageProps;

  const pageUrl = useRouter().pathname;
  useEffect(() => {
    const pageClass = pageUrl.substring(1).replace(/\//g, '-');
    document.body.classList.add(pageClass ? pageClass : 'dashboard');
    return () => {
      document.body.classList.remove(pageClass ? pageClass : 'dashboard');
    };
  }, [pageUrl]);

  return (
    <>
    <Provider store={store}>
    <ConfigProvider theme={theme}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>:: Luno Next Tailwind ::</title>
      </Head>
      {
        isAuthRoute ? (
          <AuthLayout>
            <Component {...pageProps} />
          </AuthLayout>
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )
      }
      </ConfigProvider>
      </Provider>
    </>
  );
}
