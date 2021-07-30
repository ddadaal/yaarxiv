import { CallRouteResponse } from "@/utils/callRoute";
import { GeneralSchema } from "yaarxiv-api/api/utils/schema";

type CommonErrorCode = 400 | 401 | 403 | 413;

export function expectCode<
  TSchema extends GeneralSchema,
  Code extends (number & keyof TSchema["responses"] | CommonErrorCode)
>(resp: CallRouteResponse<TSchema>, code: Code) {
  if (resp.statusCode !== code) {
    const json = resp.json() as any;
    const err = JSON.parse("message" in json ? json.message : json);
    throw new Error(`
      Expect response code failed.
      Expect: ${code}
      Received: ${resp.statusCode}

      Message: ${err.message}
      Stack: ${err.stack}
    `);

  }
}

export function expectCodeAndJson<
  TSchema extends GeneralSchema,
  Code extends (number & keyof TSchema["responses"] | CommonErrorCode)
>(resp: CallRouteResponse<TSchema>, code: Code) {
  expectCode(resp, code);
  return resp.json<Code>();
}
