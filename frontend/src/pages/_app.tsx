import React from "react";
import type { AppProps, AppContext } from "next/app";
import "normalize.css";
import useConstant from "src/utils/useConstant";
import { createI18nStore } from "simstate-i18n";
import { i18nContext } from "src/i18n";
import { StoreProvider, createStore } from "simstate";
import { MainLayout } from "src/layouts/MainLayout";
import { UserStore } from "src/stores/UserStore";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";
import App from "next/app";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);

function MyApp({ Component, pageProps, userAgent }: AppProps & { userAgent: string }) {
  console.log(pageProps);
  const i18nStore  = useConstant(() => createI18nStore(i18nContext));
  const userStore = useConstant(() => createStore(UserStore));

  return (
    <StoreProvider stores={[i18nStore, userStore]}>
      <MainLayout userAgent={userAgent}>
        <TopProgressBar />
        <Component {...pageProps} />
      </MainLayout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const userAgent = appContext.ctx.req
    ? appContext.ctx.req.headers["user-agent"] : navigator.userAgent;

  return { ...appProps, userAgent };
};

export default MyApp;
