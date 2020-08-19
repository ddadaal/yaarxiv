import React from "react";
import { AnchorProps, Anchor } from "grommet";
import Link from "next/link";
import { format, UrlObject } from "url";

interface Props extends Omit<AnchorProps, "href"> {
  href?: string | UrlObject;
  onClick?: () => void;
}

export const AnchorLink: React.FC<Props> = ({ href, onClick, ...props }) => {
  if (href) {
    return (
      <Link href={href}>
        <Anchor href={format(href)} {...props}/>
      </Link>
    );
  }else {
    return (
      <Anchor onClick={onClick} {...props}/>
    );
  }
};
