import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { Localized } from "src/i18n";
import { prefix } from "src/i18n";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { queryToIntOrDefault } from "src/utils/querystring";
import { useHttpRequest } from "src/utils/http";
import { Article } from "yaarxiv-api/api/article/models";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { HttpError } from "src/apis/fetch";
import { Forbidden } from "src/components/errors/Forbidden";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { ssrError } from "src/utils/ssr";
import { toast } from "react-toastify";
import { api } from "src/apis";
import { ssrPage } from "src/utils/ssr";
import { UserRole } from "src/models/User";

const root = prefix("pages.updateArticle.");

type Props = {
  article: Article;
};

export const ArticleUpdatePage = ssrPage<Props>(
  (props) => {
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);

    const request = useHttpRequest(setSubmitting);

    const submit = useCallback((file: File | undefined, form: ArticleForm) => {
      request(async () => {
        let pdfToken: number | undefined = undefined;
        if (file) {
          // user wants to update the pdf. so upload it first.
          const data = new FormData();
          data.append("file", file);
          const fileResp = await api.article.uploadPDF({ body: data as any });
          pdfToken = fileResp.token;
        }
        const resp = await api.article.updateArticle({
          path: { articleId: props.article.id },
          body: { pdfToken, ...form },
        });
        await router.push("/articles/[id]", `/articles/${props.article.id}`);
        toast.success(
          <Localized
            id={root("success")}
            args={[resp.revisionNumber]}
          />
        );
      });
    }, [props.article.id]);

    if ("error" in props) {

    }

    const { ...rest } = props.article.currentRevision;

    return (
      <ArticleEditForm
        disabled={submitting}
        articleId={props.article.id}
        initial={{ ...rest, authors: rest.authors.map((x) => x.name) }}
        onSubmit={submit}
      />
    );
  }, async (ctx) => {
    const user = getCurrentUserInCookie(ctx);

    const articleId = queryToIntOrDefault(ctx.query.id);

    if (!articleId) {
      return ssrError(400);
    }

    if (user) {
      const data = await api.article.getArticle({
        path: { articleId },
        query: {},
      })
        .then((x) => {
          if (x.article.ownerId !== user.id) {
            return ssrError(403, { articleId });
          } else {
            return x;
          }
        })
        .catch((x: HttpError) => ({ error: x }));

      return data;
    } else {
      return ssrError(401, { articleId });
    }
  }, {
    authOptions: { roles: [UserRole.User]},
    onError: (err) => (
      <UnifiedErrorPage
        error={err}
        customComponents={{
          403:(
            <Forbidden
              description={(
                <Localized
                  id={root("forbidden")}
                  args={[err.data.articleId]}
                />
              )}
            />
          ),
        }}
      />
    ),
  });

export default ArticleUpdatePage;
