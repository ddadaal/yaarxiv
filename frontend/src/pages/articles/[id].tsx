import React, { useContext } from "react";
import { useRouter } from "next/router";
import { queryToString } from "src/utils/querystring";
import { Box, ResponsiveContext, Heading, Text, Paragraph, Anchor } from "grommet";
import useConstant from "src/utils/useConstant";
import { compareBreakpoints } from "src/utils/compareBreakpoints";
import { GetServerSideProps } from "next";
import { Article } from "yaarxiv-api/article/models";
import { getApi } from "src/apis";
import { articleApis } from "src/apis/article";
import { useAsync } from "react-async";
import { AnchorLink } from "src/components/AnchorLink";
import { formatDateTime } from "src/utils/datetime";
import { TitledSection } from "src/components/TitledSection";
import { Section } from "src/components/Section";

interface Props {
  article: Article;
}

const api = getApi(articleApis);

const getArticle = ([id]) => api.getDetail({ path: { articleId: id } });

export const ArticlePage: React.FC<Props> = ({ article }) => {
  const responsive = useContext(ResponsiveContext);

  const bigger = compareBreakpoints(responsive, "medium") >= 0;

  const { currentRevision } = article;

  return (
    <Box direction="row" wrap={!bigger}>
      <Box margin="small" basis={bigger ? "3/4" : "100%"}>
        <Section>
          <Heading margin="none" level="1" size="small">
            {currentRevision.title}
          </Heading>
          <Box gap="small" direction="row">
            {currentRevision.authors.map((author, i) => (
              <Text key={i} size="medium">
                <AnchorLink onClick={() => {}} color="grey">
                  {author.name}
                </AnchorLink>
              </Text>
            ))}
          </Box>
          <Box>
            <Paragraph fill>
              {currentRevision.abstract}
            </Paragraph>
          </Box>
          <Box wrap direction="row" gap="small">
            {currentRevision.keywords.map((k, i) => (
              <Box key={i} border="all"
                margin={{ horizontal: "none", vertical: "xsmall" }} pad="xsmall"
              >
                <Text key={i}>{k}</Text>
              </Box>
            ))}
          </Box>
        </Section>
      </Box>
      <Box basis={bigger ? "1/4" : "100%"} margin="small" gap="small">
        <TitledSection titleId="Revisions">
          <Box gap="xsmall">
            {article.revisions.map((r) => (
              <Box key={r.number}>
                <AnchorLink
                  disabled={r.number === article.revisionNumber}
                  href={`/articles/${article.id}/revisions/${r.number}`}
                >
                  <Text weight="normal">
                    v{r.number} ({formatDateTime(r.time)})
                  </Text>
                </AnchorLink>
              </Box>
            ))}
          </Box>
        </TitledSection>
        <TitledSection titleId="Download">
          <Anchor href={currentRevision.pdfLink} download>
            PDF
          </Anchor>
        </TitledSection>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const articleId = queryToString(context.query.id);
  return { props: { article: await api.getDetail({ path: { articleId } }) }.article };
};

export default ArticlePage;
