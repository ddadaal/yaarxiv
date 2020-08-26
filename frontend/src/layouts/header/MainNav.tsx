import React, { useMemo } from "react";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { Nav, Menu, Box, BoxProps } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { useRouter, NextRouter } from "next/router";
import { Menu as MenuIcon } from "grommet-icons";
import Link from "next/link";
import { Media } from "src/styles/media";
import { TLink, commonLinks, adminLinks, userLinks } from "./links";

const root = lang.header;


const matchRoute = (mode: TLink["mode"], href: string | undefined, curr: string) => {
  if (!href || !mode) return false;
  if (mode === "exact") { return href === curr; } else { return curr.startsWith(href); }
};

const loginLink: TLink ={ textId: root.login, href: "/login" };

const Greeting = ({ name, ...rest }: { name: string } & BoxProps) => (
  <Box justify="center" {...rest}>
    <LocalizedString
      id={root.welcome}
      replacements={[name]}
    />
  </Box>
);

function linksToAnchorLink(router: NextRouter, links: TLink[]) {
  return links.map(({ href, textId, mode, onClick }) => (
    <AnchorLink
      key={textId} href={href} onClick={onClick}
      margin={{ horizontal: "xsmall" }}
      active={matchRoute(mode, href, router.pathname)}
      label={<LocalizedString id={textId} />}
    />
  ));
}

const Unfolded: React.FC<{
   user: ReturnType<typeof UserStore>["user"],
   router: NextRouter,
   authenticatedLinks: TLink[],
   logoutLink: TLink;
}> = ({ user, router, logoutLink, authenticatedLinks }) => {

  const children =
    user
      ? (
        <>
          <Greeting
            margin={{ horizontal: "medium" }}
            name={user.name}
          />
          {linksToAnchorLink(router,
            [...commonLinks, ...authenticatedLinks, logoutLink ])}
        </>
      )
      : (
        <>
          {linksToAnchorLink(router,
            [...commonLinks, loginLink])}
        </>
      );

  return (
    <Nav direction="row" gap="none">
      {children}
    </Nav>
  );
};

function linksToMenuItem(router: NextRouter, links: TLink[]){
  return links.map(({ href, textId, mode, onClick }) => ({
    label: (
      <Box pad="medium">
        {href ? (
          <Link href={href}>
            <LocalizedString id={textId}/>
          </Link>
        )
          : <LocalizedString id={textId}/>
        }
      </Box>
    ),
    onClick: onClick ?? (() => router.push(href!)),
    active: matchRoute(mode, href, router.pathname),
  }));
}

const Folded: React.FC<{
   user: ReturnType<typeof UserStore>["user"],
   router: NextRouter,
   authenticatedLinks: TLink[],
   logoutLink: TLink,
}> = ({ user, router, logoutLink, authenticatedLinks }) => {

  const items =
    user
      ? (
        <>
          <Greeting name={user.name} />
          <Menu
            plain
            items={
              linksToMenuItem(router, [...commonLinks, ...authenticatedLinks, logoutLink])
            }
          >
            <Box pad={{ horizontal: "medium", vertical: "small" }}>
              <MenuIcon/>
            </Box>
          </Menu>
        </>
      )
      : (
        <>
          <Box>
            {linksToAnchorLink(router, [loginLink])}
          </Box>
          <Menu
            label={<Box justify="center" align="center" >
              <MenuIcon />
            </Box>}
            items={linksToMenuItem(router, commonLinks)}
          />
        </>
      );

  return (
    <Nav direction="row" align="center">
      {items}
    </Nav>
  );

};

export const MainNav: React.FC = () => {

  const userStore = useStore(UserStore);

  const authenticatedLinks = userStore.user
    ? userStore.user.role === "admin" ? adminLinks : userLinks
    : [];

  const router = useRouter();

  const logoutLink = { textId: root.logout, onClick: userStore.logout };

  return (
    <>
      <Media lessThan="sm">
        <Folded
          router={router}
          user={userStore.user}
          authenticatedLinks={authenticatedLinks}
          logoutLink={logoutLink}
        />
      </Media>
      <Media greaterThanOrEqual="sm">
        <Unfolded
          router={router}
          user={userStore.user}
          authenticatedLinks={authenticatedLinks}
          logoutLink={logoutLink}
        />
      </Media>
    </>
  );
};
