import React from "react";
import { Blank, IconProps } from "grommet-icons";

export const IdIcon: React.FC<IconProps> = (props) => (
  <Blank {...props}>
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <text
        textAnchor="start"
        fontSize="24" y="20.10321" x="-0.01552"
      >ID</text>
    </svg>
  </Blank>
);
