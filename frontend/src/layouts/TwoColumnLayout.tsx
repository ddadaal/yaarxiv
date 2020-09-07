import React from "react";
import { MediaContextProvider, Media } from "src/styles/media";
import { Breakpoint } from "src/styles/theme/breakpoints";
import { Box } from "grommet";
import { MarginType, BasisType } from "grommet/utils";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  breakpoint?: Breakpoint;
  gap?: string;
  leftProportion?: BasisType;
  rightProportion?: BasisType;
}

export const TwoColumnLayout: React.FC<Props> = ({
  left,
  right,
  breakpoint = "md",
  gap = "small",
  leftProportion = "3/4",
  rightProportion = "1/4",
}) => {
  return (
    <>
      <Media lessThan={breakpoint}>
        {(className) => (
          <Box direction="row" className={className} flex wrap>
            <Box margin={{ vertical: gap }} basis={"100%"}>
              {left}
            </Box>
            <Box margin={{ vertical: gap }} basis={"100%"}>
              {right}
            </Box>
          </Box>
        )}
      </Media>
      <Media greaterThanOrEqual={breakpoint}>
        {(className) => (
          <Box
            direction="row"
            className={className}
            flex gap={gap}
          >
            <Box basis={leftProportion}>
              {left}
            </Box>
            <Box basis={rightProportion}>
              {right}
            </Box>
          </Box>
        )}
      </Media>
    </>
  );
};
