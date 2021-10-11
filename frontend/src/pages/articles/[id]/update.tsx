import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Localized } from "src/i18n";
import { prefix } from "src/i18n";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { queryToIntOrDefault } from "src/utils/querystring";
import { useHttpRequest } from "src/utils/http";
import { Article, ArticleId } from "yaarxiv-api/api/article/models";
import { getCurrentUserInCookie } from "src/stores/UserStore";
import { HttpError } from "src/apis/fetch";
import { Forbidden } from "src/components/errors/Forbidden";
import { UnifiedErrorPage } from "src/components/errors/UnifiedErrorPage";
import { ssrError } from "src/utils/ssr";
import { toast } from "react-toastify";
import { api } from "src/apis";
import { ssrPage } from "src/utils/ssr";
import { UserRole } from "src/models/User";
import { LimitedWidthPage } from "src/layouts/LimitedWidthPage";
import { I18nTitle } from "src/i18n/I18nTitle";

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
          const fileResp = await api.article.uploadScript({ body: data as any });
          pdfToken = fileResp.token;
        }

        const resp = await api.article.updateArticle({
          path: { articleId: props.article.id },
          body: {
            pdfToken,
            ...form,
          },
        });
        await router.push("/articles/[id]", `/articles/${props.article.id}`);
        toast.success(
          <Localized
            id={root("success")}
            args={[resp.revisionNumber]}
          />,
        );
      });
    }, [props.article.id]);

    const { ...rest } = props.article.currentRevision;

    return (
      <LimitedWidthPage maxWidth="large">
        <I18nTitle id={root("title")} />
        <ArticleEditForm
          disabled={submitting}
          current={{
            articleId: props.article.id,
            format: props.article.currentRevision.scriptFormat,
            revisionNumber: props.article.revisionNumber,
          }}
          initial={{
            abstract: rest.abstract,
            cnKeywords:  rest.cnKeywords,
            cnTitle:  rest.cnTitle,
            enKeywords:  rest.enKeywords,
            enTitle:  rest.enTitle,
            codeLink: rest.codeLink,
            authors: rest.authors,
            doi: rest.doi,
          }}
          onSubmit={submit}
        />
      </LimitedWidthPage>
    );
  }, async (ctx) => {
    const user = getCurrentUserInCookie(ctx);

    const articleId = queryToIntOrDefault(ctx.query.id);

    if (articleId === undefined) {
      return ssrError(400);
    }

    if (user) {
      const data = await api.article.getArticle({
        path: { articleId },
        query: {},
      })
        .then((x) => {
          if (x.article.retractTime) {
            return ssrError<SSR403Error>(403, { reason: "retracted", articleId });
          }
          if (x.article.ownerId !== user.id) {
            return ssrError<SSR403Error>(403, { reason: "notAuthor", articleId });
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
          403: (err: HttpError<SSR403Error>) => (
            <Forbidden
              description={(
                <Localized
                  id={root(err.data.reason)}
                  args={[err.data.articleId]}
                />
              )}
            />
          ),
        }}
      />
    ),
  });

interface SSR403Error {
  reason: "notAuthor" | "retracted";
  articleId: ArticleId;
}

export default ArticleUpdatePage;
