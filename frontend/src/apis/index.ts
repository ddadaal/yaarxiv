import { jsonFetch, fullFetch,  JsonFetch, FullFetch } from "./fetch";
import { homeApis, homeApisMock } from "./home";
import { authApis, authApisMock } from "./auth";
import { delay } from "src/utils/delay";

export type ApiService<T> = (
  jsonFetch: JsonFetch,
  fullFetch: FullFetch,
) => T;

export function apiService<T>(fn: ApiService<T>): T {
  return fn(jsonFetch, fullFetch);
}

export function mockApiService<T>(
  mock: ApiService<T>,
): T {
  const functions = mock(jsonFetch, fullFetch);
  return Object
    .keys(functions)
    .reduce((prev, curr) => ({
      ...prev, [curr]: async (...args) => {
        await delay(2000);
        return functions[curr](...args);
      },
    }), {}) as T;

}

const USE_MOCK = true;

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
const apis = new Map<unknown, unknown>([
  [homeApis, USE_MOCK ? homeApisMock : homeApis],
  [authApis, USE_MOCK ? authApisMock : authApis],
]);

export function getApi<T>(service: T): T {
  return apis.get(service) as T;
}
