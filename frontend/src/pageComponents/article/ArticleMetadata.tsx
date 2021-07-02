import { Box, Text } from "grommet";
import { IconProps, Upload, Edit, Code } from "grommet-icons";
import React from "react";
import { useLocalized } from "simstate-i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { IdIcon } from "src/components/icons/Id";
import { lang } from "src/i18n";
import { getCodeLinkInfo } from "src/utils/validations/codeLink";
import { formatDateTime } from "src/utils/datetime";
import { ArticleId } from "yaarxiv-api/api/article/models";

const root = lang.pages.search.item;

export const MetadataItem: React.FC<{
  textId: string;
  replacements?: React.ReactNode[];
  Icon: React.ComponentType<{ size?: IconProps["size"] }>;
  data: string | React.ReactNode;
}> = ({ textId, replacements, Icon, data }) => (
  <Box
    margin="xsmall"
    title={useLocalized(textId, replacements) as string}
    direction="row" align="center" gap="xsmall"
  >
    <Icon size={"medium"} />
    <Text>
      {data}
    </Text>
  </Box>
);

export const MetadataContainer: React.FC = ({ children }) => (
  <Box direction="row" gap="medium" wrap>
    {children}
  </Box>
);

export const ArticleMetadata: React.FC<{
  articleId: ArticleId;
  createTime: string;
  lastUpdateTime?: string;
  codeLink?: string;
}> = ({
  articleId,
  lastUpdateTime,
  createTime,
  codeLink,
}) => {

  const codeLinkObj = codeLink ? getCodeLinkInfo(codeLink) : undefined;

  return (
    <MetadataContainer>
      <MetadataItem
        textId={root.id}
        Icon={IdIcon}
        data={articleId}
      />
      <MetadataItem
        textId={root.createTime}
        Icon={Upload}
        data={formatDateTime(createTime)}
      />
      { lastUpdateTime
        ? (
          <MetadataItem
            textId={root.lastUpdateTime}
            Icon={Edit}
            data={formatDateTime(lastUpdateTime)}
          />
        ): undefined
      }
      { codeLinkObj
        ? (
          <MetadataItem
            textId={root.codeLink}
            replacements={[codeLinkObj.url]}
            Icon={Code}
            data={(
              <AnchorLink target="blank" href={codeLinkObj.url}>
                {codeLinkObj.siteName}
              </AnchorLink>
            )}
          />
        ) : undefined
      }
    </MetadataContainer>
  );
};
