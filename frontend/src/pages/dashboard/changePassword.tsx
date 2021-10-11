/* eslint-disable max-len */
import { prefix } from "src/i18n";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { ChangePasswordForm } from "src/pageComponents/Dashboard/ChangePasswordForm";

const root = prefix("pages.dashboard.changePassword.");

export const ChangePasswordPage = () => {

  return (
    <DashboardLayout titleId={root("title")}>
      <SectionTitle titleId={root("title")} />
      <ChangePasswordForm />
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
