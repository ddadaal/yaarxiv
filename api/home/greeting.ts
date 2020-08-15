import { Type } from "@sinclair/typebox";

export default {
  url: "/",
  method: "GET",
  description: "Home page greeting",
  querystring: Type.Object({ username: Type.String({ description: "The user " }) }),
  responses: {
    200: Type.Object({
      hello: Type.String({ description: "The user same as the input querystring" }),
    },{
      description: "Hello",
    }),
  },
} as const;
