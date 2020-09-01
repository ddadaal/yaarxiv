import React, { useState } from "react";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { requireAuth } from "src/utils/requireAuth";
import Router from "next/router";

const initialState ={
  title: "",
  authors: [] as string[],
  keywords: [] as string[],
  abstract: "",
};

const api = getApi(articleApis);

export const UploadPage: React.FC = requireAuth({ roles: ["user"]})(() => {

  const [submitting, setSubmitting] = useState(false);

  const request = useHttpRequest(setSubmitting);

  const submit = async (file: File | undefined, info: ArticleForm) => {
    request(async () => {
      // 1. upload the PDF and get the token
      const pdfResp = await api.uploadPDF(file!);

      // 2. upload the rest information
      const resp = await api.uploadArticle({
        body: {
          pdfToken: pdfResp.token,
          ...info,
        },
      });

      // 3. Route to complete page
      Router.push({ pathname: "/upload/complete", query: { articleId: resp.id } });
    });
  };

  return (
    <ArticleEditForm
      existingFileUrl={undefined}
      initial={initialState}
      disabled={submitting}
      onSubmit={submit}
    />
  );

});

export default UploadPage;
