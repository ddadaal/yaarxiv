import React  from "react";
import { Image, ImageProps } from "grommet";
import cn from "src/assets/cn-logo-text-right.svg";
import en from "src/assets/en-logo-text-right.svg";
import { useI18n } from "src/i18n";

interface Props extends ImageProps {
  height?: string;
  width?: string;
}

export const HeaderLogo: React.FC<Props> = (props) => {

  const i18n = useI18n();

  return (
    <Image
      fit="cover"
      src={i18n.currentLanguage.id === "en" ? en : cn}
      title="logo"
      {...props}
    />
  );
};

