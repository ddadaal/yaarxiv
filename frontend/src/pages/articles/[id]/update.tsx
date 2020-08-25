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
import { requireAuth } from "src/pageComponents/RequireAuth";
import { queryToString } from "src/utils/querystring";
import { useHttpErrorHandler } from "src/utils/useHttpErrorHandler";

const root = lang.pages.updateArticle;

const api = getApi(articleApis);

const getArticle = (articleId: string) => api.get({ path: { articleId }, query: {} })
  .then((x) => x.article);

export const ArticleUpdatePage: React.FC = requireAuth()(() => {

  const router = useRouter();

  const articleId = queryToString(router.query.articleId);

  const getArticleInfo = useCallback(() => {
    return getArticle(articleId);
  }, [articleId]);

  const { data, isPending } = useAsync({ promiseFn: getArticleInfo });

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

  if (isPending) {
    return (
      <Box align="center" gap="medium" margin="medium">
        <Spinner/>
        <Text>
          <LocalizedString id={root.loading} replacements={[articleId]} />
        </Text>
      </Box>
    );
  }

  const current = data!.currentRevision;

  return (
    <OverlayLoading loading={isPending}>
      <ArticleEditForm
        disabled={submitting}
        existingFileUrl={current.pdfLink}
        initial={{ ...current, authors: current.authors.map((x) => x.name) }}
        onSubmit={submit}
      />
    </OverlayLoading>
  );
});

export default ArticleUpdatePage;
