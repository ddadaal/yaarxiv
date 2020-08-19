/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as info from "yaarxiv-api/article/info";

export const articleApis = () => ({
  search: fromApiDefinition<search.Schema>(search.api),
  getDetail: fromApiDefinition<info.Schema>(info.api),
});

