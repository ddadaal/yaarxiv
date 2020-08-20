import { createMedia } from "@artsy/fresnel";
import { useContext, useMemo, useRef } from "react";
import { ThemeContext, ThemeType } from "grommet";
import { breakpoints } from "./theme";


const AppMedia = createMedia({
  breakpoints: {
    xs: 0,
    ...breakpoints,
  },
});

export const mediaStyles =  AppMedia.createMediaStyle();

export const { MediaContextProvider, Media } = AppMedia;
