import { TObject, TProperties } from "@sinclair/typebox";

export interface ApiDefinition<
  TQuerystring extends TProperties = TProperties,
  TBody extends TProperties = TProperties,
  TResponses extends TProperties = TProperties,
>  {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  description?: string;
  querystring?: TObject<TQuerystring>;
  body?: TObject<TBody>;
  responses: Record<number, TObject<TResponses>>;
}
