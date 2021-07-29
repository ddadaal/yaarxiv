import { prefix } from "src/i18n";
import { SideMenuLayout } from "src/layouts/SideMenuLayout";

const root = prefix("pages.dashboard.");

const links = [
  { textId: root("articles.title"), to: "articles" },
  { textId: root("accountInfo.title"), to: "account" },
  { textId: root("changePassword.title"), to: "changePassword" },
];

export const DashboardLayout: React.FC = ({ children }) => {
  return (
    <SideMenuLayout
      rootRoute="/dashboard/"
      links={links}
    >
      {children}
    </SideMenuLayout>
  );
};
