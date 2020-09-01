import React from "react";
import { HttpError } from "src/apis/fetch";
import { useInvalidTokenHandler } from "src/utils/useHttpErrorHandler";
import { Forbidden } from "./Forbidden";
import { NotAuthorized } from "./NotAuthorized";
import { NotFound } from "./NotFound";
import { ServerError } from "./ServerError";

interface Props {
  error: HttpError;
  customComponents?: { [code: number]: React.ReactElement };
}

export const UnifiedErrorPage: React.FC<Props> = ({
  error,
  customComponents = {},
}) => {

  const invalidTokenHandler = useInvalidTokenHandler();

  switch (error.status) {
  case 401:
    invalidTokenHandler();
    return customComponents[401] ?? <NotAuthorized />;
  case 403:
    return customComponents[403] ?? <Forbidden />;
  case 404:
    return customComponents[404] ?? <NotFound />;
  default:
    return customComponents[error.status] ?? <ServerError error={error} />;
  }
};
