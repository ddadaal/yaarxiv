import React from "react";
import { HttpError } from "src/apis/fetch";
import { useInvalidTokenHandler } from "src/utils/http";
import { BadRequest } from "./BadRequest";
import { Forbidden } from "./Forbidden";
import { NotAuthorized } from "./NotAuthorized";
import { NotFound } from "./NotFound";
import { ServerError } from "./ServerError";

interface Props {
  error: HttpError;
  customComponents?: { [code: number]: (err: HttpError) => React.ReactElement };
}

export const UnifiedErrorPage: React.FC<Props> = ({
  error,
  customComponents = {},
}) => {

  const invalidTokenHandler = useInvalidTokenHandler();

  switch (error.status) {
  case 400:
    return customComponents[400]?.(error) ?? <BadRequest />;
  case 401:
    invalidTokenHandler();
    return customComponents[401]?.(error) ?? <NotAuthorized />;
  case 403:
    return customComponents[403]?.(error) ?? <Forbidden />;
  case 404:
    return customComponents[404]?.(error) ?? <NotFound />;
  default:
    return customComponents[error.status]?.(error) ?? <ServerError error={error} />;
  }
};
