import { CallRouteResponse } from "@/utils/callRoute";
import { GeneralSchema } from "yaarxiv-api/api/utils/schema";

type CommonErrorCode = 400 | 401 | 403;

export function expectCode<
  TSchema extends GeneralSchema,
  Code extends (number & keyof TSchema["responses"] | CommonErrorCode)
>(resp: CallRouteResponse<TSchema>, code: Code) {
  if (resp.statusCode === code) {
    return resp.json<Code>();
  } else {
    const err = JSON.parse(resp.json().message);
    throw new Error(`
      Expect response code failed.
      Expect: ${code}
      Received: ${resp.statusCode}

      Message: ${err.message}
      Stack: ${err.stack}
    `);

  }
}
