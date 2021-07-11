import { Lock  } from "grommet-icons";
import React from "react";
import { prefix } from "src/i18n";
import { ErrorPage } from "./ErrorPage";

const root = prefix("components.errors.notAuthorized.");

interface Props {
  description?: React.ReactNode;
}

// handle 401
export const NotAuthorized: React.FC<Props> = ({ description }) => (
  <ErrorPage
    titleId={root("title")}
    defaultDescriptionId={root("description")}
    description={description}
    Icon={Lock}
  />
);
