import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import "normalize.css";
import useConstant from "src/utils/useConstant";
import { createI18nStore } from "simstate-i18n";
import { i18nContext } from "src/i18n";
import { StoreProvider, createStore } from "simstate";
import { MainLayout } from "src/layouts/MainLayout";
import { UserStore } from "src/stores/UserStore";

export default function MyApp({ Component, pageProps }: AppProps) {
  const i18nStore  = useConstant(() => createI18nStore(i18nContext));
  const userStore = useConstant(() => createStore(UserStore));

  return (
    <StoreProvider stores={[i18nStore, userStore]}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </StoreProvider>
  );
}
