import React from "react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import "normalize.css";
import { Definitions, getCookieLanguage, languages, Provider } from "src/i18n";
import { StoreProvider, createStore } from "simstate";
import { MainLayout } from "src/layouts/MainLayout";
import { loadDefinitions } from "react-typed-i18n";
import { getCurrentUserInCookie, User, UserStore } from "src/stores/UserStore";
import "nprogress/nprogress.css";
import dynamic from "next/dynamic";
import withDarkMode from "next-dark-mode";
import { ThemeStore } from "src/stores/ThemeStore";
import useConstant from "src/utils/useConstant";
import { changeToken } from "src/apis/fetch";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const TopProgressBar = dynamic(
  () => {
    return import("src/components/TopProgressBar");
  },
  { ssr: false },
);

const themeStore = createStore(ThemeStore);

type Props = AppProps & {
  user: User | null;
  firstLanguage: {
    id: string;
    definitions: Definitions;
  }
}

function MyApp({ Component, pageProps, user, firstLanguage }: Props) {

  const userStore = useConstant(() => {
    const store = createStore(UserStore, user);
    if (user) {
      changeToken(user?.token);
    }
    return store;
  });

  return (
    <Provider initialLanguage={firstLanguage}>
      <StoreProvider stores={[userStore, themeStore]}>
        <MainLayout >
          <TopProgressBar />
          <Head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff"></meta>
          </Head>
          <Component {...pageProps} />
        </MainLayout>
      </StoreProvider>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {

  const user = getCurrentUserInCookie(appContext.ctx);

  if (user) {
    changeToken(user.token);
  }

  const langId = getCookieLanguage(appContext.ctx);

  const definitions = await loadDefinitions(languages[langId] ?? languages["cn"]);

  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, user, firstLanguage: { id: langId, definitions } };
};

export default withDarkMode(MyApp);
