import type { Schema } from "yaarxiv-api/article/search";

export type SearchQuery = Schema["querystring"];

export function constructSearchString(query: SearchQuery) {
  return new URLSearchParams({ searchText: query.searchText }).toString();
}

export function searchQueryEquals(op1: SearchQuery, op2: SearchQuery) {
  return !["searchText", "startYear", "endYear", "authorNames", "page"]
    .some((key) => op1[key] !== op2[key]);
}

