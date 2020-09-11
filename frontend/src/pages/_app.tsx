import React from "react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import "normalize.css";
import { createI18nStore } from "simstate-i18n";
import { i18nContext } from "src/i18n";
import { StoreProvider, createStore } from "simstate";
import { MainLayout } from "src/layouts/MainLayout";
import { getCurrentUserInCookie, User, UserStore } from "src/stores/UserStore";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";
import withDarkMode from "next-dark-mode";
import { ThemeStore } from "src/stores/ThemeStore";
import useConstant from "src/utils/useConstant";
import { changeToken } from "src/apis/fetch";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);

const i18nStore  = createI18nStore(i18nContext);
const themeStore = createStore(ThemeStore);

function MyApp({ Component, pageProps, user }: AppProps & { user: User | null }) {

  const userStore = useConstant(() => createStore(UserStore, user));

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

  const user = getCurrentUserInCookie(appContext.ctx);

  if (user) {
    changeToken(user.token);
  }

  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, user };
};

export default withDarkMode(MyApp);
