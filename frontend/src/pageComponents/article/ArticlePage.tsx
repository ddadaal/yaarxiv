import { Anchor, Box, Heading, Paragraph, Text } from "grommet";
import React from "react";
import { AnchorLink } from "src/components/AnchorLink";
import { Section } from "src/components/Section";
import { TitledSection } from "src/components/TitledSection";
import { Localized, prefix } from "src/i18n";
import { TwoColumnLayout } from "src/layouts/TwoColumnLayout";
import { useLocalizedArticleInfo } from "src/models/Article";
import { formatDateTime } from "src/utils/datetime";
import { Article } from "yaarxiv-api/api/article/models";
import { ArticleAuthors } from "./ArticleAuthors";
import { ArticleMetadata } from "./ArticleMetadata";
import { DownloadPdfLink } from "./DownloadPdfLink";

const root = prefix("pages.article.");

interface Props {
  article: Article;
}

export const ArticlePage: React.FC<Props> = ({ article }) => {

  const { currentRevision } = article;

  const { main, alt } = useLocalizedArticleInfo(currentRevision);

  return (
    <TwoColumnLayout
      left={(
        <Section>
          <Heading margin="none" level="1" size="small">
            {main.title}
          </Heading>
          {alt?.title}
          <ArticleAuthors authors={currentRevision.authors} />
          <Box>
            <Paragraph fill>
              {currentRevision.abstract}
            </Paragraph>
          </Box>
          <Box wrap direction="row" gap="small">
            {main.keywords.map((k, i) => (
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
            doi={article.currentRevision.doi}
          />
        </Section>
      )}
      right={
        (<Box gap="medium">
          <TitledSection titleId={root("revisions")}>
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
              {
                article.retractTime ? (
                  <Text weight="normal" color="status-critical">
                    <Localized id={root("retracted")} />&nbsp;
                    ({formatDateTime(article.retractTime)})
                  </Text>
                ) : undefined
              }
            </Box>
          </TitledSection>
          {
            article.retractTime ? undefined : (
              <TitledSection titleId={root("download")}>
                <DownloadPdfLink articleId={article.id} revision={article.revisionNumber}>
                  {(downloadLink) => (
                    <Anchor
                      onClick={downloadLink}
                      target="__blank"
                    >
                  PDF
                    </Anchor>
                  )}
                </DownloadPdfLink>
              </TitledSection>
            )
          }
        </Box>
        )}
    />
  );
};
