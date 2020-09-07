/// <reference types="next" />
/// <reference types="next/types/global" />

/// <reference types="next-images" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      NEXT_PUBLIC_API_ROOT: string;
      NEXT_PUBLIC_STATIC_ROOT: string;
      NEXT_PUBLIC_USE_MOCK: "1" | "0";
    }
  }
}
