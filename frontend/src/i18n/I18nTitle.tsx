import Head from "next/head";
import React from "react";
import { Id, useI18n } from "src/i18n";

interface Props {
  id?: Id;
  text?: string;
  args?: React.ReactNode[];
}

export const I18nTitle: React.FC<Props> = ({ id, args, text }) => {

  const i18n = useI18n();

  const titleText = text ?? (id ? i18n.translate(id, args) : "");

  const separator = titleText ? " - " : "";

  return (
    <Head>
      <title>
        {titleText + separator + i18n.translate("head.name")}
      </title>
    </Head>
  );
};
