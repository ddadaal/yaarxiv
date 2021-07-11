import { Clear } from "grommet-icons";
import React from "react";
import { prefix } from "src/i18n";
import { ErrorPage } from "./ErrorPage";

const root = prefix("components.errors.badRequest.");

interface Props {
  description?: React.ReactNode;
}

// handle 403
export const BadRequest: React.FC<Props> = ({ description }) => (
  <ErrorPage
    titleId={root("title")}
    defaultDescriptionId={root("description")}
    description={description}
    Icon={Clear}
  />
);

