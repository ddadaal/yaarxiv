import React  from "react";
import { ssrPage } from "src/utils/ssr";
import { OperationCompletePage } from "src/components/OperationCompletePage";
import { Close } from "grommet-icons";
import { Box, Heading, Paragraph } from "grommet";
import { SetupForm } from "src/pageComponents/setup/SetupForm";
import { Localized, prefix } from "src/i18n";
import { api } from "src/apis";
import { I18nTitle } from "src/i18n/I18nTitle";

interface Props {
  setup: boolean;
}

const root = prefix("pages.setup.");

export const SetupPage = ssrPage<Props>(({ setup }) => {

  if (setup) {
    return (
      <OperationCompletePage
        icon={<Close />}
        titleId={root("conflict")}
      />
    );
  } else {
    return (
      <Box align="center" justify="center" pad="medium" flex="grow">
        <I18nTitle id="pages.setup.title" />
        <Box width="medium" border="all" pad="medium" elevation="small">
          <Heading alignSelf="center" level="2" margin="none">
            <Localized id={root("title")} />
          </Heading>
          <Paragraph style={{ textAlign: "center" }}>
            <Localized id={root("description")} />
          </Paragraph>
          <SetupForm />
        </Box>
      </Box>
    );
  }
}, async () => {
  const data = await api.setup.queryIfSetup({});

  return data;
}, {});

export default SetupPage;
