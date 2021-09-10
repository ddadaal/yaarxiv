import React from "react";
import { AnchorProps, Anchor } from "grommet";
import Link from "next/link";
import { UrlObject } from "url";
import styled from "styled-components";

const NoFocusEffectAnchor = styled(Anchor)`
  box-shadow: none;
`;

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
  title?: string;
}

export const AnchorLink: React.FC<Props> = ({
  href,
  as,
  onClick, ...props
}) => {
  if (href) {
    return (
      <Link href={href} as={as} passHref>
        <NoFocusEffectAnchor {...props} />
      </Link>
    );
  }else {
    return (
      <NoFocusEffectAnchor onClick={onClick} {...props}/>
    );
  }
};
