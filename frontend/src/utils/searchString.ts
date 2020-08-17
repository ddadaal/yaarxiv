export interface SearchQuery {
  keyword?: string;
  yearRange?: [number, number];
  authors?: string[];
}

export function constructSearchString(query: SearchQuery) {
  return new URLSearchParams({ keyword: query.keyword }).toString();
}
