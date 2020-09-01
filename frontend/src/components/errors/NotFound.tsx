import { StatusUnknown } from "grommet-icons";
import React from "react";
import { lang } from "src/i18n";
import { ErrorPage } from "./ErrorPage";

const root = lang.components.errors.notFound;

interface Props {
  description?: React.ReactNode;
}

// handle 404
export const NotFound: React.FC<Props> = ({ description }) => (
  <ErrorPage
    titleId={root.title}
    defaultDescriptionId={root.description}
    description={description}
    Icon={StatusUnknown}
  />
);
