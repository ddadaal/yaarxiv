export interface SearchQuery {
  searchText?: string;
  startYear?: number;
  endYear?: number;
  authors?: string[];
}

export function constructSearchString(query: SearchQuery) {
  return new URLSearchParams({ searchText: query.searchText }).toString();
}

export function searchQueryEquals(op1: SearchQuery, op2: SearchQuery) {
  return !["searchText", "startYear", "endYear", "authors"]
    .some((key) => op1[key] !== op2[key]);
}
