import { Box } from "grommet";
import React from "react";
import { requireAuth } from "src/components/RequireAuth";

const DashboardPage = requireAuth()(({ userStore }) => {
  return (
    <Box>
      {userStore.user?.name}
    </Box>
  );
});

export default DashboardPage;
