import React from "react";
import { HttpError } from "src/apis/fetch";
import { prefix } from "src/i18n";
import { ErrorPage } from "./ErrorPage";
import { Alert } from "grommet-icons";

const root = prefix("components.errors.");

interface Props {
  error: HttpError;
}

// handle 500
export const ServerError: React.FC<Props> = ({ error }) => {
  return (
    <ErrorPage
      titleId={root("serverError.title")}
      defaultDescriptionId={root("serverError.description")}
      Icon={Alert}
    >
      {JSON.stringify(error)}
    </ErrorPage>
  );
};
