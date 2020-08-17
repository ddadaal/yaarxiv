import React from "react";
import { AnchorProps, Anchor } from "grommet";
import Link from "next/link";

export const AnchorLink: React.FC<AnchorProps> = ({ href, ...props }) => {
  return (
    <Link href={href}>
      <Anchor {...props}/>
    </Link>
  );
};
