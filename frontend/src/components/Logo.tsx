import React, { CSSProperties } from "react";
import { Image } from "grommet";

interface Props {
  style?: CSSProperties;
}

export const Logo: React.FC<Props> = (props)=> (
  <Image
    fit="contain"
    src="logo.svg"
    title="logo"
  />
);
