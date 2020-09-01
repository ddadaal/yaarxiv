import { Clear } from "grommet-icons";
import React from "react";
import { lang } from "src/i18n";
import { ErrorPage } from "./ErrorPage";

const root = lang.components.errors.forbidden;

interface Props {
  description?: React.ReactNode;
}

// handle 403
export const Forbidden: React.FC<Props> = ({ description }) => (
  <ErrorPage
    titleId={root.title}
    defaultDescriptionId={root.description}
    description={description}
    Icon={Clear}
  />
);

