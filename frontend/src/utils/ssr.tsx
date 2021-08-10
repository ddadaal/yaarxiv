import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import React from "react";
import { HttpError, makeHttpError } from "src/apis/fetch";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { AuthOptions, requireAuth } from "./requireAuth";

export type SSRPageProps<TData> = TData | { error: HttpError };

export const ssrError = <T,>(statusCode: number, data?: T) => {
  return { error: makeHttpError(statusCode, data) };
};

export const ssrPage = <TData,>
  (
    Component: React.ComponentType<TData>,
    getInitialProps?: (ctx: NextPageContext) => Promise<SSRPageProps<TData>>,
    options?: {
      authOptions?: AuthOptions,
      onError?: (error: HttpError) => React.ReactElement,
    }
  ): NextPage<SSRPageProps<TData>> => {

  const { authOptions, onError } = options ?? {};

  let Page: NextPage<SSRPageProps<TData>> = (props) => {
    if ("error" in props) {
      console.log(props.error);
      return onError ? onError(props.error) : <UnifiedErrorPage error={props.error} />;
    }
    return <Component {...props} />;
  };

  if (authOptions) {
    Page = requireAuth(authOptions)(Page);
  }

  if (getInitialProps) {

    Page.getInitialProps = async (ctx) => {

      if (authOptions) {
        const user = getCurrentUserInCookie(ctx);
        if (!user) {
          return ssrError(401);
        }
        if (authOptions.roles && !authOptions.roles.includes(user.role)) {
          return ssrError(403);
        }
      }

      return await getInitialProps(ctx)
        .catch((e) => {
          if (e instanceof HttpError) {
            return { error: e };
          } else {
            throw e;
          }
        });

    };
  }
  return Page;
};


export function rerunGetInitialProps() {
  Router.replace(Router.asPath);
}
