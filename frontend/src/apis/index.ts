import {
  jsonFetch, fullFetch,  JsonFetch,
  FullFetch, HttpError, makeHttpError,
} from "./fetch";
import { authApis, authApisMock } from "./auth";
import { delay } from "src/utils/delay";
import { articleApis, articleApisMock } from "./article";
import { isServer } from "src/utils/isServer";
import { decrementRequest, incrementRequest } from "src/components/TopProgressBar";

export type ApiArgs = {
  jsonFetch: JsonFetch,
  fullFetch: FullFetch,
  makeHttpError: <T>(data: T, status: number) => HttpError<T>,
};

export type Api<T> = (actions: ApiArgs) => Record<string, T>;

export type MockApi<TApi extends (actions: ApiArgs) => any> =
  (actions: Pick<ApiArgs, "makeHttpError">) => ReturnType<TApi>;

export function createMockApi<T extends (actions: ApiArgs) => any>
(mock: MockApi<T>): MockApi<T> {
  const functions = (mock as any)({ makeHttpError });
  return Object
    .keys(functions)
    .reduce((prev, curr) => ({
      ...prev, [curr]: async (...args: any) => {
        if (!isServer()) {
          incrementRequest();
        }
        await delay(1000);
        return functions[curr](...args)
          .finally(() => {
            if (!isServer()) {
              decrementRequest();
            }});
      },
    }), {}) as T;
}

const USE_MOCK = false;

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
const apis = [
  [authApis, USE_MOCK ? authApisMock : authApis],
  [articleApis, USE_MOCK ? articleApisMock : articleApis],
];

const computedApis = new Map<unknown, unknown>(apis.map(([key, value]) => [
  key,
  USE_MOCK
    ? createMockApi((value as MockApi<any>))
    : (value as Api<any>)({ jsonFetch, fullFetch, makeHttpError }),
]));

export function getApi<TR, T extends Api<TR>>(service: T): ReturnType<T> {
  return computedApis.get(service) as ReturnType<T>;
}
