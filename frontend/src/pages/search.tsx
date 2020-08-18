import React, { useContext, useCallback, useEffect, useState } from "react";
import { Box, ResponsiveContext, Grid, Collapsible } from "grommet";
import { useRouter } from "next/router";
import { SearchBar } from "src/components/SearchBar";
import { useAsync } from "react-async";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { searchQueryEquals, SearchQuery } from "src/models/SearchQuery";
import { ArticleItem } from "src/components/Article/ArticleItem";
import { GetServerSideProps } from "next";
import { ArticlePreview } from "yaarxiv-api/article/search";
import { compareBreakpoints } from "src/utils/compareBreakpoints";
import { OverlayLoading } from "src/components/OverlayLoading";
import { setLazyProp } from "next/dist/next-server/server/api-utils";

const api = getApi(articleApis);

interface Props {
  results: ArticlePreview[];
  totalCount: number;
}

const promiseFn = ({ query }) => api.search(query, undefined);


export const Search: React.FC<Props> = (props) => {

  const router = useRouter();

  const query = router.query;

  // const { data: { results, totalCount }, isPending, reload } = useAsync({
  //   promiseFn,
  //   watch: Math.random(),
  //   // watchFn: (curr, prev) => !searchQueryEquals(curr.query, prev.query),
  //   initialValue: { results: props.results ?? [], totalCount: props.totalCount ?? 0 },
  //   query,
  // });
  // console.log(isPending);
  const [results,setResults] = useState(props.results ?? []);
  const [isPending, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    promiseFn({ query }).then(({ results }) => {
      setResults(results);
      setIsLoading(false);
    });
  }, [query]);

  return (
    <Box flex="grow" direction="column">
      <Box justify="center" align="center" margin="small">
        <SearchBar query={query}/>
      </Box>
      <ResponsiveContext.Consumer>
        {(res) => {
          const bigger = compareBreakpoints(res, "medium") >= 0;
          return (
            <Box direction="row" wrap={!bigger}>
              <Box margin="small"
                basis={bigger ? "3/4" : "100%"}
                border="all" pad="small" elevation="small"
              >
                <OverlayLoading loading={isPending} showSpinner={results.length === 0}>
                  <Box>
                    {results.map((r, i) => (
                      <Box key={r.id} gap="small" margin="small" >
                        <ArticleItem article={r}   />
                        { i === results.length -1 ? undefined : <Box border="all"/>}
                      </Box>
                    ))}
                  </Box>
                </OverlayLoading>
              </Box>
              <Box margin="small" basis={bigger ? "1/4" : "100%"}>
                filter
              </Box>
            </Box>
          );
        }}
      </ResponsiveContext.Consumer>

    </Box>
  );
};

// export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
//   const query = context.query;
//   return { props: await api.search(query, undefined) };
// };

export default Search;
