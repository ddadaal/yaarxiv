import React, { useCallback, useLayoutEffect } from "react";
import { Box, ResponsiveContext } from "grommet";
import { useRouter } from "next/router";
import { SearchBar } from "src/components/SearchBar";
import { useAsync } from "react-async";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { SearchQuery } from "src/models/SearchQuery";
import { ArticleItem } from "src/components/Article/ArticleItem";
import { GetServerSideProps } from "next";
import { ArticlePreview } from "yaarxiv-api/article/search";
import { compareBreakpoints } from "src/utils/compareBreakpoints";
import { OverlayLoading } from "src/components/OverlayLoading";
import { Separator } from "src/components/Separator";
import { ArticleFilter } from "src/components/Article/ArticleFilter";

const api = getApi(articleApis);

interface Props {
  results: ArticlePreview[];
  totalCount: number;
}

function queryToString(input: string | string[]): string {
  return Array.isArray(input) ? input[input.length-1] : input;
}

function numberOfZero(input: string | string[]): number {
  const i = queryToString(input);
  const n = Number.parseInt(i);
  return (!Number.isNaN(n) && n > 0) ? n : 0;
}

const search = ([query]: any[]) => api.search(query, undefined);


export const Search: React.FC<Props> = (props) => {

  const router = useRouter();

  const query = router.query;

  const { data: { results }, isPending, run } = useAsync({
    deferFn: search,
    initialValue: { results: props.results ?? [], totalCount: props.totalCount ?? 0 },
  });

  const updateQuery = useCallback((newQuery: Partial<SearchQuery>) => {
    const combinedQuery = { ...query, ...newQuery };
    router.push({ pathname: "/search", query: combinedQuery });
    run(query);
  }, [query]);

  // console.log(isPending);
  // const [results,setResults] = useState(props.results ?? []);
  // const [isPending, setIsLoading] = useState(false);


  // useEffect(() => {
  //   setIsLoading(true);
  //   console.log(query);
  //   promiseFn({ query }).then(({ results }) => {
  //     setResults(results);
  //     setIsLoading(false);
  //   });
  // }, [query]);

  return (
    <Box flex="grow" direction="column">
      <Box justify="center" align="center" margin="small">
        <SearchBar
          initialText={queryToString(query?.searchText ?? "")}
          onConfirm={(k) => updateQuery({ searchText: k })}
        />
      </Box>
      <ResponsiveContext.Consumer>
        {(res) => {
          const bigger = compareBreakpoints(res, "medium") >= 0;
          return (
            <Box direction="row" wrap={!bigger}>
              <Box margin="small"
                basis={bigger ? "3/4" : "100%"}
                border="all" pad="xsmall" elevation="small"
              >
                <OverlayLoading loading={isPending} showSpinner={results.length === 0}>
                  <Box>
                    {results.map((r, i) => (
                      <Box key={r.id} gap="small" margin="small" >
                        <ArticleItem article={r} />
                        { i === results.length -1 ? undefined : <Separator />}
                      </Box>
                    ))}
                  </Box>
                </OverlayLoading>
              </Box>
              <Box basis={bigger ? "1/4" : "100%"} margin="small">
                <ArticleFilter
                  startYear={numberOfZero(query.startYear)}
                  endYear={numberOfZero(query.endYear)}
                  onAuthorsChange={updateQuery}
                  onYearChange={updateQuery}
                />
              </Box>
            </Box>
          );
        }}
      </ResponsiveContext.Consumer>

    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const query = context.query;
  return { props: await api.search(query, undefined) };
};

export default Search;
