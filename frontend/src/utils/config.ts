import getConfig from "next/config";
import { isServer } from "./isServer";

export interface AppConfig {
  apiRoot: string;
  staticRoot: string;
  pdfSizeLimit: number;
}


export const config: AppConfig = getConfig().publicRuntimeConfig;

if (isServer()) {
  console.log("Loaded runtime config: ", JSON.stringify(config, null, 2));
}
