import React from "react";
import { Box, Heading, Text, Paragraph, Anchor } from "grommet";
import { Article } from "yaarxiv-api/article/models";
import { AnchorLink } from "src/components/AnchorLink";
import { formatDateTime } from "src/utils/datetime";
import { TitledSection } from "src/components/TitledSection";
import { Section } from "src/components/Section";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";

interface Props {
  article: Article;
}

export const ArticlePage: React.FC<Props> = ({ article }) => {

  const { currentRevision } = article;

  return (
    <TwoColumnLayout
      left={(
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
      )}
      right={
        (<Box>
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
        )}
    />
  );
};
