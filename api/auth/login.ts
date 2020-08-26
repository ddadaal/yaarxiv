export const endpoint = {
  url: "/user/auth",
  method: "GET" ,
} as const;

export const summary = "Login using id and password";

export type UserRole = "user" | "admin";

/** Login */
export interface LoginSchema {
  querystring: {
    /** The login id, for example email */
    id: string;
    /** The password */
    password: string;
  };
  responses: {
    /** The request is success */
    200: {
      /** The generated token */
      token: string;
      /** The name of the user */
      name: string;
      /** The role of the user. */
      role: UserRole;
    },
    /** The request fails */
    401: {
    }
  }
}

