import React from "react";
import { Stack, Box, AnchorProps, StackProps } from "grommet";
import { Spinner } from "./Spinner";
import styled from "styled-components";

interface Props {
  loading: boolean;
  anchor?: StackProps["anchor"];
  showSpinner?: boolean;
}

const TransparentBox = styled(Box)<{ transparent: boolean }>`
  opacity: ${ (props) => props.transparent ? 0.5 : 1 };
`;

export const OverlayLoading: React.FC<Props> = ({
  loading,
  children,
  anchor = "center",
  showSpinner = true,
}) => {

  return (
    <Box height={{ min: "xxsmall" }}>

      <Stack anchor={anchor} fill>
        <TransparentBox transparent={loading}>
          {children}
        </TransparentBox>
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
