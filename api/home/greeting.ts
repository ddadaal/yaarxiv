export const endpoint = {
  url: "/",
  method: "GET",
} as const;

/** Home page api */
export interface GreetingSchema {
  querystring: {
    /** The username */
    username: string;
  },
  responses: {
    /** Hello */
    200: {
      /** The user same as the input querystring */
      hello: string;
    }
  }
}
