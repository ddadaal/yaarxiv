export interface Schema<
  TPath,
  TQuerystring,
  TBody,
  TResponses,
> {
  path ?: TPath;
  querystring?: TQuerystring;
  body?: TBody;
  responses: TResponses;
}

export type GeneralSchema = Schema<any, any, any, any>;

export type Endpoint<_TSchema extends GeneralSchema> = {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
}

export interface SchemaObject {
  description: string;
  properties: {
    path?: any;
    querystring?: any;
    body?: any;
    responses:  { properties?: any };
  }
}

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type Responses<T extends GeneralSchema> = T["responses"];

export type ResponseBody<
  TSchema extends GeneralSchema,
  ResponseCode extends number = 200,
> =
  Awaited<Responses<TSchema>[ResponseCode]>;


export type SuccessResponse<T extends GeneralSchema> =
  Responses<T>[200] extends object
  ? Responses<T>[200]
  : Responses<T>[201] extends object ? Responses<T>[201] : never;
