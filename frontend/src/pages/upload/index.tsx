import React, { useState } from "react";

import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { requireAuth } from "src/utils/requireAuth";
import Router from "next/router";
import { api } from "src/apis";
import { UserRole } from "src/models/User";

const initialState ={
  title: "",
  authors: [] as string[],
  keywords: [] as string[],
  abstract: "",
};

export const UploadPage: React.FC = requireAuth({ roles: [UserRole.User]})(() => {

  const [submitting, setSubmitting] = useState(false);

  const request = useHttpRequest(setSubmitting);

  const submit = async (file: File, info: ArticleForm) => {
    request(async () => {
      // 1. upload the PDF and get the token
      const data = new FormData();
      data.append("file", file);

      const pdfResp = await api.article.uploadPDF({ body: data as any });

      // 2. upload the rest information
      const resp = await api.article.uploadArticle({
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
