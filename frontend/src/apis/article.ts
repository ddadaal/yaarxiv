/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as info from "yaarxiv-api/article/info";
import * as revision from "yaarxiv-api/article/revision";

export const articleApis = () => ({
  search: fromApiDefinition<search.SearchArticleSchema>(search.endpoint),
  getDetail: fromApiDefinition<info.GetArticleWithIdSchema>(info.endpoint),
  getDetailWithRevision: fromApiDefinition<revision.GetArticleWithIdAndRevisionSchema>(revision.endpoint),
});

