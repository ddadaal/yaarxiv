import { CallRouteResponse } from "@/utils/callRoute";
import { GeneralSchema } from "yaarxiv-api/api/utils/schema";

type CommonErrorCode = 400 | 401 | 403 | 413;

export function expectCode<
  TSchema extends GeneralSchema,
  Code extends (number & keyof TSchema["responses"] | CommonErrorCode)
>(resp: CallRouteResponse<TSchema>, code: Code, extraInfo?: any) {
  if (resp.statusCode !== code) {
    const json = resp.json() as any;

    throw new Error(`
      Expect response code failed.
      Expect: ${code}
      Received: ${resp.statusCode}

      ${JSON.stringify(json)}

      Extras:
      ${extraInfo}
    `);

  }
}

export function expectCodeAndJson<
  TSchema extends GeneralSchema,
  Code extends (number & keyof TSchema["responses"] | CommonErrorCode)
>(resp: CallRouteResponse<TSchema>, code: Code, extraInfo?: any) {
  expectCode(resp, code, extraInfo);
  return resp.json<Code>();
}

export function expectErrorResponse<
  TSchema extends GeneralSchema,
  StatusCode extends (number & keyof TSchema["responses"] | CommonErrorCode),
  Code extends TSchema["responses"][StatusCode]["code"],
>(resp: CallRouteResponse<TSchema>, statusCode: StatusCode, code?: Code, extraInfo?: any) {
  const json = expectCodeAndJson(resp, statusCode, extraInfo);
  if (code) {
    expect(json.code).toBe(code);
  }
}
