/* eslint-disable max-len */
import React from "react";
import { prefix } from "src/i18n";
import { DashboardLayout } from "src/pageComponents/Dashboard/DashboardLayout";
import { SectionTitle } from "src/pageComponents/Dashboard/SectionTitle";
import { ChangePasswordForm } from "src/pageComponents/Dashboard/ChangePasswordForm";

const root = prefix("pages.dashboard.");

export const ChangePasswordPage = () => {

  return (
    <DashboardLayout>
      <SectionTitle titleId={root("changePassword.title")} />
      <ChangePasswordForm />
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
