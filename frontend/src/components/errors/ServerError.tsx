import React from "react";
import { HttpError } from "src/apis/fetch";
import { lang } from "src/i18n";
import { ErrorPage } from "./ErrorPage";
import { Alert } from "grommet-icons";

const root = lang.components.errors;

interface Props {
  error: HttpError;
}

// handle 500
export const ServerError: React.FC<Props> = ({ error }) => {
  return (
    <ErrorPage
      titleId={root.serverError.title}
      defaultDescriptionId={root.serverError.description}
      Icon={Alert}
    >
      {JSON.stringify(error)}
    </ErrorPage>
  );
};
