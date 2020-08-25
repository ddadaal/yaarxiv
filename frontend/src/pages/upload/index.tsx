import { useRouter } from "next/router";
import React, { useState } from "react";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { requireAuth } from "src/pageComponents/RequireAuth";
import { useNotification } from "src/components/useNotification";

const initialState ={
  file: undefined,
  title: "",
  authors: [] as string[],
  keywords: [] as string[],
  abstract: "",
};

const api = getApi(articleApis);

export const UploadPage: React.FC = requireAuth()(() => {

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const notification = useNotification();

  const submit = async (info: ArticleForm) => {
    try {
      setSubmitting(true);

      // 1. upload the PDF and get the token
      const pdfResp = await api.uploadPDF(info.file!);

      // 2. upload the rest information
      const resp = await api.uploadArticle({
        body: {
          pdfToken: pdfResp.token,
          ...info,
        },
      });

      // 3. Route to complete page
      router.push({ pathname: "/upload/complete", query: { articleId: resp.id } });
    } catch (e) {
      notification.addNotification({
        level: "error",
        message: "Some network error is detected. Please retry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ArticleEditForm
      initial={initialState}
      disabled={submitting}
      onSubmit={submit}
    />
  );

});

export default UploadPage;
