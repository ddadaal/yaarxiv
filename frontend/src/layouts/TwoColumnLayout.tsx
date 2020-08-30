import React from "react";
import { MediaContextProvider, Media } from "src/styles/media";
import { Breakpoint } from "src/styles/theme/breakpoints";
import { Box } from "grommet";
import { MarginType, BasisType } from "grommet/utils";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  breakpoint?: Breakpoint;
  margin?: MarginType;
  leftProportion?: BasisType;
  rightProportion?: BasisType;
}

export const TwoColumnLayout: React.FC<Props> = ({
  left,
  right,
  breakpoint = "md",
  margin = "small",
  leftProportion = "3/4",
  rightProportion = "1/4",
}) => {
  return (
    <>
      <Media lessThan={breakpoint}>
        {(className) => (
          <Box direction="row" className={className} flex wrap>
            <Box margin={margin} basis={"100%"}>
              {left}
            </Box>
            <Box margin={margin} basis={"100%"}>
              {right}
            </Box>
          </Box>
        )}
      </Media>
      <Media greaterThanOrEqual={breakpoint}>
        {(className) => (
          <Box direction="row" className={className} flex>
            <Box margin={margin} basis={leftProportion}>
              {left}
            </Box>
            <Box margin={margin} basis={rightProportion}>
              {right}
            </Box>
          </Box>
        )}
      </Media>
    </>
  );
};
