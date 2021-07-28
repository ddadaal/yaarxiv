import { Tabs, Tab, Box } from "grommet";
import { useRouter } from "next/router";
import React from "react";
import { AnchorLink } from "src/components/AnchorLink";
import { List, ListItem } from "src/components/List";
import { Id, Localized } from "src/i18n";
import { Media } from "src/styles/media";

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
    <>
      <Media lessThan="md">
        <Tabs
          activeIndex={activeIndex}
        >
          {
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
          }
        </Tabs>
      </Media>
      <Media greaterThanOrEqual="md">
        <Box
          margin={{ vertical: "medium" }}
          direction="row"
          basis="auto"
          flex
          gap="large"
        >
          <Box basis={"15%"}>
            <List>
              {links.map((l, i) => {
                return (
                  <ListItem
                    index={i} key={l.to}
                  >
                    <AnchorLink href={l.to} active={i === activeIndex}>
                      <Localized id={l.textId} />
                    </AnchorLink>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box basis={"85%"}>
            {children}
          </Box>
        </Box>
      </Media>
    </>
  );
};

