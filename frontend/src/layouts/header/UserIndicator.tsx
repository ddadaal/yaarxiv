import React, { useContext } from "react";
import { useStore } from "simstate";
import { UserStore } from "src/stores/UserStore";
import { Nav, Anchor, ResponsiveContext, Menu } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";
import { AnchorLink } from "src/components/AnchorLink";
import { useRouter } from "next/router";

const root = lang.header;

const navLinks = [
  { href: "/upload", label: root.upload },
  { href: "/dashboard", label: root.dashboard },
];

export const UserIndicator: React.FC = () => {

  const router = useRouter();

  const userStore = useStore(UserStore);

  const responsive = useContext(ResponsiveContext);


  if (!userStore.loggedIn) {
    return <AnchorLink href="/login" label={<LocalizedString id={root.login} />} />;
  }

  const greeting = (
    <LocalizedString
      id={root.welcome}
      replacements={[userStore.user.name]}
    />
  );

  if (responsive === "small") {
    return (
      <Menu
        label={greeting}
        items={[
          ...navLinks.map(({ href, label }) => ({
            label: <LocalizedString id={label} />,
            onClick: () => router.push(href),
          })),
          {
            label: <LocalizedString id={root.logout} />,
            onClick: () => userStore.logout(),
          },
        ]}
      />);
  }

  return (
    <Nav direction="row">
      {greeting}
      {
        navLinks.map(({ href, label }) => (
          <AnchorLink key={href} href={href} label={<LocalizedString id={label} />} />
        ))
      }
      <Anchor
        onClick={() => userStore.logout()}
        label={<LocalizedString id={root.logout}/>}
      />
    </Nav>
  );
};
