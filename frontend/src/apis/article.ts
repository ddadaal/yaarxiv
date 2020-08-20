/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as info from "yaarxiv-api/article/info";

export const articleApis = () => ({
  search: fromApiDefinition<search.SearchArticleSchema>(search.endpoint),
  getDetail: fromApiDefinition<info.GetArticleWithIdSchema>(info.endpoint),
});

