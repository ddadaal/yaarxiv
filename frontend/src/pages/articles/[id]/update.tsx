import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { lang } from "src/i18n";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { queryToString } from "src/utils/querystring";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { requireAuth } from "src/utils/requireAuth";
import { Article } from "yaarxiv-api/article/models";
import { NextPage } from "next";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { HttpError, makeHttpError } from "src/apis/fetch";
import { Forbidden } from "src/components/errors/Forbidden";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { SSRPageProps } from "src/utils/ssr";

const root = lang.pages.updateArticle;

const api = getApi(articleApis);

type Props = SSRPageProps<{
  article: Article;
}>;

export const ArticleUpdatePage: NextPage<Props> =
  requireAuth({ roles: ["user"]})<Props>((props) => {
    const router = useRouter();

    const articleId = queryToString(router.query.id);

    const [submitting, setSubmitting] = useState(false);

    const request = useHttpRequest(setSubmitting);

    const submit = useCallback((file: File | undefined, form: ArticleForm) => {
      request(async ({ notification }) => {
        let pdfToken: string | undefined = undefined;
        if (file) {
          // user wants to update the pdf. so upload it first.
          const fileResp = await api.uploadPDF(file);
          pdfToken = fileResp.token;
        }
        const resp = await api.updateArticle({
          path: { articleId },
          body: { pdfToken, ...form },
        });
        await router.push("/articles/[id]", `/articles/${articleId}`);
        notification.addNotification({
          level: "success",
          message: (
            <LocalizedString
              id={root.success}
              replacements={[resp.revisionNumber]}
            />
          ),
        });
      });
    }, [articleId]);

    if ("error" in props) {
      return (
        <UnifiedErrorPage
          error={props.error}
          customComponents={{
            403:(
              <Forbidden
                description={(
                  <LocalizedString
                    id={root.forbidden}
                    replacements={[articleId]}
                  />
                )}
              />
            ),
          }}
        />
      );
    }

    const { pdfLink, ...rest } = props.article.currentRevision;

    return (
      <ArticleEditForm
        disabled={submitting}
        existingFileUrl={pdfLink}
        initial={{ ...rest, authors: rest.authors.map((x) => x.name) }}
        onSubmit={submit}
      />
    );
  });

// Cannot use getServerSideProps
// https://github.com/vercel/next.js/discussions/11183
ArticleUpdatePage.getInitialProps = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  if (user) {
    const data = await api.get({
      path: { articleId: queryToString(ctx.query.id) },
      query: {},
    })
      .then((x) => {
        if (x.article.ownerId !== user.id) {
          throw makeHttpError({}, 403);
        } else {
          return x;
        }
      })
      .catch((x: HttpError) => ({ error: x }));

    return data;
  } else {
    return { error: { status: 401, data: {} } } ;
  }
};

export default ArticleUpdatePage;
