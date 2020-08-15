import { jsonFetch, fullFetch,  JsonFetch, FullFetch } from "./fetch";
import { homeApis, homeApisMock } from "./home";

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
  return mock(jsonFetch, fullFetch);
}

const USE_MOCK = true;

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
const apis = new Map<unknown, unknown>([
  [homeApis, USE_MOCK ? homeApisMock : homeApis],
]);

export function getApiService<T>(service: T): T {
  return apis.get(service) as T;
}
