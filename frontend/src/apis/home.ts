import { fromApiDefinition } from "./fetch";
import { apiService, mockApiService } from ".";
import loginApi from "yaarxiv-api/auth/login";

export const homeApis = apiService(() => ({ login: fromApiDefinition(loginApi) }));

export const homeApisMock = mockApiService<typeof homeApis>(() => ({ login: async () => { return { token: true };} }));
