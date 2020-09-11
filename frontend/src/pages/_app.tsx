import React from "react";
import type { AppContext, AppProps } from "next/app";
import "normalize.css";
import { createI18nStore } from "simstate-i18n";
import { i18nContext } from "src/i18n";
import { StoreProvider, createStore } from "simstate";
import { MainLayout } from "src/layouts/MainLayout";
import { UserStore } from "src/stores/UserStore";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";
import { ThemeStore } from "src/stores/ThemeStore";
import { GetServerSideProps } from "next";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);

const i18nStore  = createI18nStore(i18nContext);
const userStore = createStore(UserStore);
const themeStore = createStore(ThemeStore);

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <StoreProvider stores={[i18nStore, userStore, themeStore]}>
      <MainLayout >
        <TopProgressBar />
        <Component {...pageProps} />
      </MainLayout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  return { props: {} };
};

export default MyApp;
