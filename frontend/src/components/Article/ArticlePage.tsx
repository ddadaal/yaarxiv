import React, { useContext } from "react";
import { Box, ResponsiveContext, Heading, Text, Paragraph, Anchor } from "grommet";
import { compareBreakpoints } from "src/utils/compareBreakpoints";
import { Article } from "yaarxiv-api/article/models";
import { AnchorLink } from "src/components/AnchorLink";
import { formatDateTime } from "src/utils/datetime";
import { TitledSection } from "src/components/TitledSection";
import { Section } from "src/components/Section";

interface Props {
  article: Article;
}

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
                <AnchorLink color="grey">
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
