import { TObject, TProperties, Static } from "@sinclair/typebox";

export interface ApiDefinition<
  TQuerystring extends TProperties = TProperties,
  TBody extends TProperties = TProperties,
> {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  description?: string;
  querystring?: TObject<TQuerystring>;
  body?: TObject<TBody>;
  responses: Record<number, TObject<TProperties>>;
}

type ValueOf<T> = T[keyof T];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapStatic<T> = T extends any ? Static<T> : never;
export type Responses<T extends ApiDefinition> = MapStatic<ValueOf<T["responses"]>>;

export { Static };
