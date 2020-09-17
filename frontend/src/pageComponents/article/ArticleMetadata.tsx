import { Box, Text } from "grommet";
import { IconProps, Bookmark, Upload, Edit } from "grommet-icons";
import React from "react";
import { useLocalized } from "simstate-i18n";
import { IdIcon } from "src/components/icons/Id";
import { lang } from "src/i18n";
import { formatDateTime } from "src/utils/datetime";

const root = lang.pages.search.item;

export const MetadataItem: React.FC<{
  textId: string;
  Icon: React.ComponentType<{ size?: IconProps["size"] }>;
  data: string;
}> = ({ textId, Icon, data }) => (
  <Box
    margin="xsmall"
    title={useLocalized(textId) as string}
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
  articleId: string;
  createTime: string;
  lastUpdateTime?: string;
}> = ({
  articleId,
  lastUpdateTime,
  createTime,
}) => {
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
    </MetadataContainer>
  );
};
