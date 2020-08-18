import {
  jsonFetch, fullFetch,  JsonFetch,
  FullFetch, HttpError, makeHttpError,
} from "./fetch";
import { authApis, authApisMock } from "./auth";
import { delay } from "src/utils/delay";
import { articleApis, articleApisMock } from "./article";

export type ApiService<T> = (actions: {
  jsonFetch: JsonFetch,
  fullFetch: FullFetch,
  makeHttpError: <T>(data: T, status: number) => HttpError<T>,
}) => T;

export function apiService<T>(fn: ApiService<T>): T {
  return fn({ jsonFetch, fullFetch, makeHttpError });
}

export function mockApiService<T>(
  mock: ApiService<T>,
): T {
  const functions = mock({ jsonFetch, fullFetch, makeHttpError });
  return Object
    .keys(functions)
    .reduce((prev, curr) => ({
      ...prev, [curr]: async (...args: any) => {
        await delay(5000);
        return functions[curr](...args);
      },
    }), {}) as T;

}

const USE_MOCK = true;

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
const apis = new Map<unknown, unknown>([
  [authApis, USE_MOCK ? authApisMock : authApis],
  [articleApis, USE_MOCK ? articleApisMock : articleApis],
]);

export function getApi<T>(service: T): T {
  return apis.get(service) as T;
}
