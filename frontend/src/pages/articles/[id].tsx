import React, { useContext } from "react";
import { useRouter } from "next/router";
import { queryToString } from "src/utils/querystring";
import { Box, ResponsiveContext, Heading } from "grommet";
import useConstant from "src/utils/useConstant";
import { compareBreakpoints } from "src/utils/compareBreakpoints";
import { GetServerSideProps } from "next";
import { Article } from "yaarxiv-api/article/models";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { useAsync } from "react-async";

interface Props {
  article: Article;
}

const api = getApi(articleApis);

const getArticle = ([id]) => api.getDetail({ path: { articleId: id } });

export const ArticlePage: React.FC<Props> = ({ article }) => {
  const responsive = useContext(ResponsiveContext);

  const bigger = compareBreakpoints(responsive, "medium") >= 0;

  // const { data: { article }, isPending, run } = useAsync({
  //   deferFn: getArticle,
  //   initialValue: props,
  // });

  return (
    <Box direction="row" wrap={!bigger}>
      <Box margin="small"
        basis={bigger ? "3/4" : "100%"}
        pad="xsmall" elevation="small"
      >
        <Heading level="1">{article.currentRevision.title}</Heading>
      </Box>
      <Box basis={bigger ? "1/4" : "100%"} margin="small">

      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const articleId = queryToString(context.query.id);
  return { props: { article: await api.getDetail({ path: { articleId } }) }.article };
};

export default ArticlePage;
