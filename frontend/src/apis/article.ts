/* eslint-disable max-len */
import { fromApiDefinition } from "./fetch";
import * as search from "yaarxiv-api/article/search";
import * as getWithInfo from "yaarxiv-api/article/getWithId";
import * as getWithRevision from "yaarxiv-api/article/getWithRevision";

export const articleApis = () => ({
  search: fromApiDefinition<search.SearchArticleSchema>(search.endpoint),
  getWithId: fromApiDefinition<getWithInfo.GetArticleWithIdSchema>(getWithInfo.endpoint),
  getWithIdAndRevision: fromApiDefinition<getWithRevision.GetArticleWithIdAndRevisionSchema>(getWithRevision.endpoint),
});

