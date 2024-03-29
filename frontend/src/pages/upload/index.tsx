import React, { useState } from "react";

import { ArticleEditForm, ArticleForm } from "src/pageComponents/article/ArticleEditForm";
import { useHttpRequest } from "src/utils/http";
import { requireAuth } from "src/utils/requireAuth";
import Router from "next/router";
import { api } from "src/apis";
import { UserRole } from "src/models/User";
import { LimitedWidthPage } from "src/layouts/LimitedWidthPage";
import { I18nTitle } from "src/i18n/I18nTitle";

const initialState ={
  cnTitle: "",
  cnKeywords: [],
  enTitle: "",
  enKeywords: [],
  codeLink: "",
  authors: [],
  abstract: "",
  doi: "",
} as ArticleForm;

export const UploadPage: React.FC = requireAuth({ roles: [UserRole.User]})(() => {

  const [submitting, setSubmitting] = useState(false);

  const request = useHttpRequest(setSubmitting);

  const submit = async (file: File, form: ArticleForm) => {
    request(async () => {
      // 1. upload the PDF and get the token
      const data = new FormData();
      data.append("file", file);

      const pdfResp = await api.article.uploadScript({ body: data as any });

      // 2. upload the rest information
      const resp = await api.article.uploadArticle({
        body: {
          pdfToken: pdfResp.token,
          ...form,
        },
      });

      // 3. Route to complete page
      Router.push({ pathname: "/upload/complete", query: { articleId: resp.id } });
    });
  };

  return (
    <LimitedWidthPage maxWidth="large">
      <I18nTitle id="header.upload" />
      <ArticleEditForm
        current={undefined}
        initial={initialState}
        disabled={submitting}
        onSubmit={submit}
      />
    </LimitedWidthPage>
  );

});

export default UploadPage;
