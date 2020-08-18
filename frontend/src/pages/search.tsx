import React, { useContext } from "react";
import { Box, ResponsiveContext, Grid, Collapsible } from "grommet";
import { useRouter } from "next/router";
import { SearchBar } from "src/components/SearchBar";
import { useAsync } from "react-async";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { searchQueryEquals } from "src/models/SearchQuery";
import { ArticleItem } from "src/components/Article/ArticleItem";
import { GetServerSideProps } from "next";
import { ArticlePreview } from "yaarxiv-api/article/search";
import { compareBreakpoints } from "src/utils/compareBreakpoints";

const api = getApi(articleApis);

interface Props {
  results: ArticlePreview[];
  totalCount: number;
}


export const Search: React.FC<Props> = (props) => {

  const router = useRouter();

  const query = router.query;

  const { data: { results, totalCount }, isLoading } = useAsync({
    promiseFn: () => api.search(query, undefined),
    watch: query,
    watchFn: (curr, prev) => !searchQueryEquals(curr.watch, prev.watch),
    initialValue: { results: props.results, totalCount: props.totalCount },
  });

  return (
    <Box flex="grow" direction="column">
      <Box justify="center" align="center" margin="small">
        <SearchBar query={query}/>
      </Box>
      <ResponsiveContext.Consumer>
        {(res) => {
          const bigger = compareBreakpoints(res, "medium") >= 0;
          console.log(res, bigger);
          return (
            <Box direction="row" wrap={!bigger}>
              <Box margin="small"
                basis={bigger ? "3/4" : "100%"}
                border="all" pad="small" elevation="small"
              >
                {results.map((r, i) => (
                  <Box key={r.id} gap="small" margin="small" >
                    <ArticleItem article={r}   />
                    { i === results.length -1 ? undefined : <Box border="all"/>}
                  </Box>
                ))}
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const query = context.query;
  return { props: await api.search(query, undefined) };
};

export default Search;
