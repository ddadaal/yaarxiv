import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { lang } from "src/i18n";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { queryToString } from "src/utils/querystring";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";
import { requireAuth } from "src/utils/requireAuth";
import { Article } from "yaarxiv-api/article/models";
import { GetServerSideProps } from "next";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { changeToken, HttpError } from "src/apis/fetch";
import { NotFound } from "src/components/errors/NotFound";
import { ServerError } from "src/components/errors/ServerError";

const root = lang.pages.updateArticle;

const api = getApi(articleApis);

type Props = {
  article: Article;
} | {
  serverError: HttpError;
}


export const ArticleUpdatePage = requireAuth({ roles: ["user"]})<Props>((props) => {

  const router = useRouter();

  const articleId = queryToString(router.query.id);

  const [submitting, setSubmitting] = useState(false);

  const handler = useHttpErrorHandler(setSubmitting);

  const submit = useCallback((file: File | undefined, form: ArticleForm) => {
    handler(async ({ notification }) => {
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
      notification.addNotification({
        level: "success",
        message: (
          <LocalizedString
            id={root.success}
            replacements={[resp.revisionNumber]}
          />
        ),
      });
      router.push(`/articles/${articleId}`);
    });
  }, [articleId]);

  if (!("article" in props)) {
    if (props.serverError.status === 404) {
      return <NotFound />;
    } else {
      return <ServerError error={props.serverError} />;
    }
  }

  const current = props.article.currentRevision;

  return (
    <ArticleEditForm
      disabled={submitting}
      existingFileUrl={current.pdfLink}
      initial={{ ...current, authors: current.authors.map((x) => x.name) }}
      onSubmit={submit}
    />
  );
});

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = getCurrentUserInCookie(ctx);

  if (user) {
    changeToken(user.token);
    const data = await api.get({
      path: { articleId: queryToString(ctx.query.id) },
      query: {},
    });

    return { props: data };
  } else {
    return { props: { serverError: { status: 401, data: {} } } };
  }
};

export default ArticleUpdatePage;
