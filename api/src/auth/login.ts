import { Type, Static } from "@sinclair/typebox";

export default {
  url: "/login",
  method: "GET" as const,
  description: "Home page testing",
  schema: {
    querystring: Type.Object({
      username: Type.String({ description: "The username" }),
      password: Type.String({ description: "The password" }),
      captcha: Type.Optional(Type.String({ description: "The captch if exists" })),
    }, { description: "The query" }),
    body: Type.Object({ item: Type.Integer({ description: "The body" }) }),
    responses: {
      200: Type.Object({ token: Type.String({ description: "The generated token" }) },
        { description: "The request is ok." }),
      403: Type.Object({ reason: Type.Optional(Type.String()) },
        { description: "The request fails. " }),
    },
  },
};
