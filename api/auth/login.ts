export const api = {
  url: "/user/auth",
  method: "GET" ,
} as const;

export const summary = "Login using id and password";

/** Login */
export interface Schema {
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
    },
    /** The request fails */
    403: {
    }
  }
}

// ======= Auto-generated JSON schema begin =======
export const schema = {
  Schema: {
    type: "object",
    properties: {
      querystring: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The login id, for example email",
          },
          password: {
            type: "string",
            description: "The password",
          },
        },
        required: [
          "id",
          "password",
        ],
        additionalProperties: false,
      },
      responses: {
        type: "object",
        properties: {
          "200": {
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "The generated token",
              },
              name: {
                type: "string",
                description: "The name of the user",
              },
            },
            required: [
              "token",
              "name",
            ],
            additionalProperties: false,
            description: "The request is success",
          },
          "403": {
            type: "object",
            additionalProperties: false,
            description: "The request fails",
          },
        },
        required: [
          "200",
          "403",
        ],
        additionalProperties: false,
      },
    },
    required: [
      "querystring",
      "responses",
    ],
    additionalProperties: false,
    description: "Login",
  },
};
// ======= Auto-generated JSON schema end =======
