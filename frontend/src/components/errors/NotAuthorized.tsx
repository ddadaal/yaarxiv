import { Lock  } from "grommet-icons";
import React from "react";
import { lang } from "src/i18n";
import { ErrorPage } from "./ErrorPage";

const root = lang.components.errors.notAuthorized;

export const NotAuthorized = () => (
  <ErrorPage
    titleId={root.title}
    descriptionId={root.description}
    Icon={Lock}
  />
);
