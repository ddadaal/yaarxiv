import React from "react";
import Router from "next/router";
import { Box, Image } from "grommet";
import { SearchBar } from "src/components/SearchBar";
import cn from "src/assets/cn.svg";
import en from "src/assets/en.svg";
import { useI18n } from "src/i18n";
import { I18nTitle } from "src/i18n/I18nTitle";

const Logo: React.FC = () => {
  const i18n = useI18n();

  return (
    <Image
      fit="contain"
      src={i18n.currentLanguage.id === "en" ? en : cn}
      title="logo"
    />
  );
};



const Home: React.FC = () => {

  return (
    <Box justify="center" flex="grow">
      <I18nTitle />
      <Box justify="center" align="center" pad="small">
        <Box width="medium" height="small">
          <Logo />
        </Box>
        <Box width="500px">
          <SearchBar
            initialText=""
            onConfirm={(k) => Router.push({
              pathname: "/search",
              query: { searchText: k },
            })}
            boxProps={{ width: "500px" }}
          />
        </Box>
        <Box height="small" />
      </Box>
    </Box>
  );
};

export default Home;
