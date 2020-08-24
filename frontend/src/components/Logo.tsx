import React, { CSSProperties } from "react";
import SvgLogo from "public/logo.svg";
import { Image } from "grommet";

interface Props {
  style?: CSSProperties;
}

export const Logo: React.FC<Props> = (props)=> (
  <Image fit="contain"
    src={SvgLogo} title="logo"
  />
);
