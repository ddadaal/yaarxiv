import type { SearchArticleSchema } from "yaarxiv-api/api/article/search";

export type SearchQuery = SearchArticleSchema["querystring"];

export function searchQueryEquals(op1: SearchQuery, op2: SearchQuery) {
  return !["searchText", "startYear", "endYear", "authorNames", "page"]
    .some((key) => op1[key] !== op2[key]);
}

