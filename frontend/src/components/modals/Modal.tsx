import { Layer, Box, Heading, Button, Text } from "grommet";
import React from "react";

interface Props {
  open?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode[];
  onClose?: () => void;
}

export const Modal: React.FC<Props> = ({
  open = false,
  title,
  content,
  footer,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
}) => {
  if (open) {
    return (
      <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
        <Box pad="medium" gap="small" width="medium">
          <Heading level={3} margin="none">
            {title}
          </Heading>
          <Text>
            {content}
          </Text>
          <Box
            as="footer"
            gap="small"
            direction="row"
            align="center"
            justify="end"
            pad={{ top: "medium", bottom: "small" }}
          >
            {footer}
          </Box>
        </Box>
      </Layer>
    );
  } else {
    return null;
  }
};
