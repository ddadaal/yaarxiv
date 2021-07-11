import { Box, Text } from "grommet";
import { IconProps, Upload, Edit, Code } from "grommet-icons";
import React from "react";
import { AnchorLink } from "src/components/AnchorLink";
import { IdIcon } from "src/components/icons/Id";
import { prefix, useI18n } from "src/i18n";
import { getCodeLinkInfo } from "src/utils/validations/codeLink";
import { formatDateTime } from "src/utils/datetime";
import { ArticleId } from "yaarxiv-api/api/article/models";

const root = prefix("pages.search.item.");

export const MetadataItem: React.FC<{
  title: string;
  Icon: React.ComponentType<{ size?: IconProps["size"] }>;
  data: string | React.ReactNode;
}> = ({ title, Icon, data }) => (
  <Box
    margin="xsmall"
    title={title}
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

  const i18n = useI18n();

  return (
    <MetadataContainer>
      <MetadataItem
        title={i18n.translate(root("id")) as string}
        Icon={IdIcon}
        data={articleId}
      />
      <MetadataItem
        title={i18n.translate(root("createTime")) as string}
        Icon={Upload}
        data={formatDateTime(createTime)}
      />
      { lastUpdateTime
        ? (
          <MetadataItem
            title={i18n.translate(root("lastUpdateTime")) as string}
            Icon={Edit}
            data={formatDateTime(lastUpdateTime)}
          />
        ): undefined
      }
      { codeLinkObj
        ? (
          <MetadataItem
            title={i18n.translate(root("codeLink"), [codeLinkObj.url]) as string}
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
