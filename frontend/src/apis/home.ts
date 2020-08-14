import { Querystring, Response } from "apitypes/home.route";
import { JsonFetch } from "./fetch";
import { apiService, mockApiService } from ".";

export const homeApis = apiService((fetch) => ({
  query: async (request: Querystring) => {
    return await fetch<Response>({
      path: "/",
      method: "GET",
      query: request as Record<keyof Querystring, string>,
    });
  },
}));

export const homeApisMock = mockApiService(homeApis, () => ({
  query: async (request) => {
    return { success: true, status: 200 };
  },
}));
