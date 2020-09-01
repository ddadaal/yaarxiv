/// <reference types="next" />
/// <reference types="next/types/global" />

/// <reference types="next-images" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      API_ROOT: string;
      STATIC_ROOT: string;
      USE_MOCK: "true" | "false";
    }
  }
}
