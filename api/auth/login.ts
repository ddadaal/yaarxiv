import { Type } from "@sinclair/typebox";

export default {
  url: "/login",
  method: "GET" ,
  description: "Home page testing",
  querystring: Type.Object({
    username: Type.String({ description: "The username" }),
    password: Type.String({ description: "The password" }),
    captcha: Type.Optional(Type.String({ description: "The captch if exists" })),
  }, { description: "The query" }),
  responses: {
    200: Type.Object({ token: Type.String({ description: "The generated token" }) },
      { description: "The request is ok." }),
    403: Type.Object({ reason: Type.Optional(Type.String()) },
      { description: "The request fails. " }),
  },
} as const;
