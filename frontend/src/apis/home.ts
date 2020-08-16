/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import { apiService, mockApiService } from ".";
import { api, Schema } from "yaarxiv-api/auth/login";

export const homeApis = apiService(() => ({ login: fromApiDefinition<Schema>(api) }));

export const homeApisMock = mockApiService<typeof homeApis>(() => ({ login: async () => { return [{ token: "123" }, 200];} }));

