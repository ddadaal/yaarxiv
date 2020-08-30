import React from "react";
import { Box, Heading, Text, Paragraph, Anchor } from "grommet";
import { Article } from "yaarxiv-api/article/models";
import { AnchorLink } from "src/components/AnchorLink";
import { formatDateTime } from "src/utils/datetime";
import { TitledSection } from "src/components/TitledSection";
import { Section } from "src/components/Section";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";
import { lang } from "src/i18n";

const root = lang.pages.article;

interface Props {
  article: Article;
}

export const ArticlePage: React.FC<Props> = ({ article }) => {

  const { currentRevision } = article;

  console.log(article);

  return (
    <TwoColumnLayout margin={{ vertical: "medium", horizontal: "none" }}
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
        (<Box gap="medium">
          <TitledSection titleId={root.revisions}>
            <Box gap="xsmall">
              {article.revisions.map((r) => (
                <Box key={r.number}>
                  <AnchorLink
                    disabled={r.number === article.revisionNumber}
                    href={{ pathname: "/articles/[id]", query: { revision: r.number } }}
                    as={{
                      pathname: `/articles/${article.id}`,
                      query: { revision: r.number },
                    }}

                  >
                    <Text weight="normal">
                    v{r.number} ({formatDateTime(r.time)})
                    </Text>
                  </AnchorLink>
                </Box>
              ))}
            </Box>
          </TitledSection>
          <TitledSection titleId={root.download}>
            <Anchor href={currentRevision.pdfLink} download>
            PDF
            </Anchor>
          </TitledSection>
        </Box>
        )}
    />
  );
};
