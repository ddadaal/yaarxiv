import React from "react";
import { Stack, Box, AnchorProps, StackProps } from "grommet";
import { Spinner } from "./Spinner";

declare module "grommet" {
  interface BoxProps {
    opacity?: number | string;
  }
}

interface Props {
  loading: boolean;
  anchor?: StackProps["anchor"];
  showSpinner?: boolean;
}

export const OverlayLoading: React.FC<Props> = ({
  loading,
  children,
  anchor = "center",
  showSpinner = true,
}) => {

  return (
    <Stack anchor={anchor}>
      <Box opacity={loading ? "medium" : undefined}>
        {children}
      </Box>
      { loading && showSpinner
        ? (
          <Spinner />
        )
        : undefined
      }
    </Stack>
  );
};
