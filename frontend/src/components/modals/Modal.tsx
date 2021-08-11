import { Layer, Box, Heading } from "grommet";
import React from "react";

interface Props {
  open?: boolean;
  title?: React.ReactNode;
  footer?: React.ReactNode[];
  onClose?: () => void;
}

export const ModalFooter: React.FC = ({ children }) => (
  <Box
    as="footer"
    gap="small"
    direction="row"
    align="center"
    justify="end"
    pad={{ top: "medium", bottom: "small" }}
  >
    {children}
  </Box>
);

export const Modal: React.FC<Props> = ({
  open = false,
  title,
  children,
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
          {children}
          {
            footer ? (
              <ModalFooter>{footer}</ModalFooter>
            ) : undefined
          }
        </Box>
      </Layer>
    );
  } else {
    return null;
  }
};
