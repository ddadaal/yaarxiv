import { prefix } from "src/i18n";
import { SideMenuLayout } from "src/layouts/SideMenuLayout";

const root = prefix("pages.dashboard.");

const links = [
  { textId: root("information.title"), to: "profile" },
  { textId: root("changePassword.title"), to: "changePassword" },
  { textId: root("articles.title"), to: "articles" },
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
