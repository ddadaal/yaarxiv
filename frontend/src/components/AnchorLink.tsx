import React from "react";
import { AnchorProps, Anchor } from "grommet";
import Link from "next/link";
import { UrlObject } from "url";

declare module "grommet" {
  interface AnchorProps {
    active?: boolean;
  }
}

interface Props extends Omit<AnchorProps, "href" | "as"> {
  href?: string | UrlObject;
  as?: string | UrlObject;
  onClick?: () => void;
  target?: string;
}

export const AnchorLink: React.FC<Props> = ({
  href,
  as,
  onClick, ...props
}) => {
  if (href) {
    return (
      <Link href={href} as={as} passHref>
        <Anchor {...props} />
      </Link>
    );
  }else {
    return (
      <Anchor onClick={onClick} {...props}/>
    );
  }
};
