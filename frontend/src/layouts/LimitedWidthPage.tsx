import { Box } from "grommet";

interface Props {
  maxWidth: string;
}

export const LimitedWidthPage: React.FC<Props> = ({ maxWidth, children }) => {
  return (
    <Box align="center">
      <Box width={{ max: maxWidth }}>
        {children}
      </Box>
    </Box>
  );
};
