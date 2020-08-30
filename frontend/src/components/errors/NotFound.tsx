import { StatusUnknown } from "grommet-icons";
import React from "react";
import { lang } from "src/i18n";
import { ErrorPage } from "./ErrorPage";

const root = lang.components.errors.notFound;

export const NotFound = () => (
  <ErrorPage
    titleId={root.title}
    descriptionId={root.description}
    Icon={StatusUnknown}
  />
);
