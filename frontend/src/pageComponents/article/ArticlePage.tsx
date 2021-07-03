import React from "react";
import { Box, Heading, Text, Paragraph, Anchor } from "grommet";
import { Article } from "yaarxiv-api/api/article/models";
import { AnchorLink } from "src/components/AnchorLink";
import { formatDateTime } from "src/utils/datetime";
import { TitledSection } from "src/components/TitledSection";
import { Section } from "src/components/Section";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";
import { lang } from "src/i18n";
import { getServerStaticFileUrl } from "src/utils/staticFiles";
import { ArticleMetadata } from "./ArticleMetadata";
import { ArticleAuthors } from "./ArticleAuthors";

const root = lang.pages.article;

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
          <ArticleAuthors authors={currentRevision.authors} />
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
          <ArticleMetadata
            articleId={article.id}
            createTime={article.createTime}
            codeLink={article.currentRevision.codeLink}
          />
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
            <Anchor
              href={getServerStaticFileUrl(currentRevision.pdfLink)}
              download
              target="__blank"
            >
            PDF
            </Anchor>
          </TitledSection>
        </Box>
        )}
    />
  );
};
