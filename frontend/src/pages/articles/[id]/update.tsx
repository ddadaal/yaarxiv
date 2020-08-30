import { Box, Text } from "grommet";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useAsync } from "react-async";
import { LocalizedString } from "simstate-i18n";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Spinner } from "src/components/Spinner";
import { lang } from "src/i18n";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { queryToString } from "src/utils/querystring";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";
import { requireAuth } from "src/utils/requireAuth";
import { Article } from "yaarxiv-api/article/models";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { changeToken, HttpError } from "src/apis/fetch";
import { NotFound } from "src/components/errors/NotFound";
import { ServerError } from "src/components/errors/ServerError";

const root = lang.pages.updateArticle;

const api = getApi(articleApis);

interface Props {
  articleInfo: Article | null;
  serverError?: HttpError;
}

export const ArticleUpdatePage = requireAuth({ roles: ["user"]})<Props>((props) => {

  const { articleInfo, serverError } = props;

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

  if (!articleInfo) {
    if (serverError) {
      return <ServerError error={serverError} />;
    } else {
      return <NotFound />;
    }
  }

  const current = articleInfo.currentRevision;

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
  console.log(user, ctx.query, ctx.params);

  if (user) {
    changeToken(user.token);
    try  {
      const resp = await api.get({
        path: { articleId: queryToString(ctx.query.id) },
        query: {},
      });
      return { props: { articleInfo: resp.article } };
    } catch (e) {
      const ex = e as HttpError;
      if (ex.status === 404) {
        return { props: { articleInfo: null } };
      } else {
        return { props: { articleInfo: null, serverError: ex } };
      }
    }

  } else {
    return { props: { articleInfo: null } };
  }
};

export default ArticleUpdatePage;
