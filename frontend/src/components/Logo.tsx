import React, { CSSProperties } from "react";
import SvgLogo from "public/logo.svg";

interface Props {
  style?: CSSProperties;
}

export const Logo: React.FC<Props> = (props)=> (
  <img
    src={SvgLogo} title="logo" {...props}
  />
);
