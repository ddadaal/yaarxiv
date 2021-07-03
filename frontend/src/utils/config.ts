import getConfig from "next/config";

export interface AppConfig {
  clientApiRoot: string;
  serverApiRoot: string;
  serverStaticFileRoot: string;
  pdfSizeLimit: number;
}

export const config: AppConfig = getConfig().publicRuntimeConfig;
