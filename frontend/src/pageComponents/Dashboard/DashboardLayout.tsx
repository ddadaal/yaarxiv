import { Id, prefix } from "src/i18n";
import { I18nTitle } from "src/i18n/I18nTitle";
import { SideMenuLayout } from "src/layouts/SideMenuLayout";

const root = prefix("pages.dashboard.");

const links = [
  { textId: root("articles.title"), to: "articles" },
  { textId: root("accountInfo.title"), to: "account" },
  { textId: root("profile.title"), to: "profile" },
  { textId: root("changePassword.title"), to: "changePassword" },
];

interface Props {
  titleId: Id;
}

export const DashboardLayout: React.FC<Props> = ({ titleId, children }) => {
  return (
    <SideMenuLayout
      rootRoute="/dashboard/"
      links={links}
    >
      <I18nTitle id={titleId} />
      {children}
    </SideMenuLayout>
  );
};
