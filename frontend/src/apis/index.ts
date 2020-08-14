import { jsonFetch, fullFetch,  JsonFetch, FullFetch } from "./fetch";
import { homeApis, homeApisMock } from "./home";

export type ApiService<T> = (
  jsonFetch: JsonFetch,
  fullFetch: FullFetch,
) => T;

export function apiService<T>(fn: ApiService<T>): ApiService<T> {
  return fn;
}

export function mockApiService<T>(
  apiService: ApiService<T>,
  mock: ApiService<T>,
): ApiService<T> {
  return mock;
}

const USE_MOCK = true;

// judge whether USE_MOCK here can help reduce the size of bundle
// by helping the builder remove the mock modules at build time
const apis = [
  [homeApis, USE_MOCK ? homeApisMock : homeApis],
] as [ApiService<unknown>, ApiService<unknown>][];

const apiConfig = new Map<ApiService<unknown>, unknown>();

apis.forEach((item) => {
  apiConfig.set(item[0], item[1](jsonFetch, fullFetch));
});

export function getApiService<T>(service: ApiService<T>): T {
  return apiConfig.get(service) as T;
}
