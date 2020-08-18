import React from "react";
import { Stack, Box, AnchorProps, StackProps } from "grommet";
import { Spinner } from "./Spinner";
import styled from "styled-components";

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
    <Box height={{ min: "xxsmall" }}>

      <Stack anchor={anchor} fill>
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
    </Box>
  );
};
