import { Tabs, Tab } from "grommet";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AnchorLink } from "src/components/AnchorLink";
import { Id, Localized } from "src/i18n";

interface Props {
  links: {
    textId: Id;
    to: string;
  }[];
  rootRoute: string;
}

export const SideMenuLayout: React.FC<Props> = ({ children, links, rootRoute }) => {

  const router = useRouter();


  const activeIndex = links
    .findIndex((x) => router.pathname.startsWith(rootRoute + x.to));

  return (
    <Tabs activeIndex={activeIndex}>
      { useMemo(() => (
        links.map((l, i) => (
          <Tab
            key={l.to}
            title={(
              <AnchorLink href={rootRoute + l.to} active={i === activeIndex}>
                <Localized id={l.textId} />
              </AnchorLink>
            )}
          >
            {
              i === activeIndex
                ? children
                : undefined
            }
          </Tab>
        ))
      ), [activeIndex, children])
      }
    </Tabs>
  );
  // }
};
