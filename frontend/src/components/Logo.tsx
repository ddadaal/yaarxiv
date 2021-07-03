import React, { CSSProperties } from "react";
import { Image } from "grommet";
import logo from "src/assets/logo.svg";

interface Props {
  style?: CSSProperties;
}

export const Logo: React.FC<Props> = ()=> (
  <Image
    fit="contain"
    src={logo}
    title="logo"
  />
);
