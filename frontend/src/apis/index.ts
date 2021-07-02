import { delay } from "src/utils/delay";
import { realApi } from "./api";
import { mockApi } from "./mock";

function logApiCall(api: typeof realApi): typeof realApi {
  const rec = (obj) => {
    return Object
      .entries(obj)
      .reduce((prev, [key, val]) => {
        if (typeof val === "function") {
          prev[key] = async (...args: any) => {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line max-len
              console.log(`Calling API ${val.name}, args ${JSON.stringify(args)}`);
            }
            await delay(500);
            return val(...args);
          };
        } else {
          prev[key] = rec(val);
        }
        return prev;
      }, {});
  };

  return rec(api) as typeof realApi;
}


// changing this line during development to set USE_MOCK dynamically
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";

// judge whether USE_MOCK here can help reduce the size of bundle
// by tree shaking mock modules at production build
export const api = USE_MOCK ? logApiCall(mockApi) : realApi;

