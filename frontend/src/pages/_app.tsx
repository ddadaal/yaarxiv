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
import { ThemeStore } from "src/stores/ThemeStore";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps) {
  const i18nStore  = useConstant(() => createI18nStore(i18nContext));
  const userStore = useConstant(() => createStore(UserStore));
  const themeStore = useConstant(() => createStore(ThemeStore));

  return (
    <StoreProvider stores={[i18nStore, userStore, themeStore]}>
      <MainLayout >
        <TopProgressBar />
        <Component {...pageProps} />
      </MainLayout>
    </StoreProvider>
  );
}

export default MyApp;
