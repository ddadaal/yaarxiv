import React, { useCallback, useEffect, useState } from "react";
import { Box } from "grommet";
import { useRouter } from "next/router";
import { useAsync } from "react-async";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { SearchQuery } from "src/models/SearchQuery";
import { ArticleSearchItem } from "src/pageComponents/article/ArticleSearchItem";
import { GetServerSideProps } from "next";
import { OverlayLoading } from "src/components/OverlayLoading";
import { ArticleFilter } from "src/pageComponents/article/ArticleFilter";
import { queryToIntOrDefault, queryToString, queryToArray } from "src/utils/querystring";
import { Pagination } from "src/components/Pagination";
import { SearchBar } from "src/components/SearchBar";
import { ArticleSearchResult } from "yaarxiv-api/article/search";
import { Author } from "yaarxiv-api/article/models";
import { Section } from "src/components/Section";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";
import { useFirstMount } from "src/utils/useFirstMount";
import { HttpError } from "src/apis/fetch";
import { SSRPageProps } from "src/utils/ssr";
import { ServerError } from "src/components/errors/ServerError";

const api = getApi(articleApis);

type Props = SSRPageProps<{
  results: ArticleSearchResult[];
  totalCount: number;
}>;

const search = ([query]: any[]) => api.search({ query });


export const Search: React.FC<Props> = (props) => {

  const router = useRouter();

  const query = router.query;

  if ("error" in props) {
    return <ServerError error={props.error} />;
  }

  const { data, isPending, run } = useAsync({
    deferFn: search,
    initialValue: { results: props.results ?? [], totalCount: props.totalCount ?? 0 },
  });

  const firstMount = useFirstMount();

  useEffect(() => {
    if (!firstMount) {
      run(query);
    }
  }, [query]);

  const { results, totalCount } = data!;

  const updateQuery = useCallback((newQuery: Partial<SearchQuery>) => {
    const combinedQuery = { ...query, ...newQuery };
    console.log(query, newQuery, combinedQuery);
    router.push({ pathname: "/search", query: combinedQuery });
  }, [router, run, query]);

  const onAuthorClicked = ({ name }: Author) => {
    const authorNames = [...queryToArray(query.authorNames)];
    if (!authorNames.includes(name)) {
      authorNames.push(name);
    }
    updateQuery({ authorNames });
  };

  const onKeywordClicked = (keyword: string) => {
    const keywords = [...queryToArray(query.keywords)];
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
    }
    updateQuery({ keywords });
  };

  const currentPage = queryToIntOrDefault(query.page, 1);

  return (
    <Box flex="grow" direction="column">
      <Box justify="center" align="center" margin="small">
        <SearchBar
          initialText={queryToString(query?.searchText ?? "")}
          onConfirm={(k) => updateQuery({ searchText: k })}
        />
      </Box>
      <Box direction="row" justify="center" flex="grow">
        <TwoColumnLayout
          left={
            <Section pad="none" elevation={"none"}>
              <OverlayLoading loading={isPending} showSpinner={totalCount === 0}>
                <Box gap="large">
                  {results.map((r) => (
                    <ArticleSearchItem
                      key={r.articleId}
                      article={r}
                      onAuthorClicked={onAuthorClicked}
                      onKeywordClicked={onKeywordClicked}
                    />
                  ))}
                </Box>
                <Box direction="row" justify="center">
                  <Pagination
                    currentPage={currentPage}
                    itemsPerPage={10}
                    totalItemsCount={totalCount}
                    getUrl={(i) => ({
                      pathname: "/search",
                      query: { ...query, page: i },
                    })}
                  />
                </Box>
              </OverlayLoading>
            </Section>
          }
          right={
            <ArticleFilter
              startYear={queryToIntOrDefault(query.startYear)}
              endYear={queryToIntOrDefault(query.endYear)}
              authorNames={queryToArray(query.authorNames)}
              keywords={queryToArray(query.keywords)}
              onAuthorsChange={updateQuery}
              onYearChange={updateQuery}
              onKeywordsChange={updateQuery}
            />
          }
        />
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const query = context.query;

  const data = await api.search({ query })
    .catch((r: HttpError) => ({ error: r }));

  return { props: data };
};

export default Search;
