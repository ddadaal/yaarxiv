export const api = {
  url: "/user",
  method: "POST" ,
} as const;

export const summary = "Register.";

/** Register */
export interface Schema {
  querystring: {
    /** The email. Requires to be an edu email*/
    email: string;
    /** The password */
    password: string;
  };
  responses: {
    /** Registration is success. */
    201: {
      /** The generated token */
      token: string;
    },
    /** The email already exists. */
    405: {

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
          email: {
            type: "string",
            description: "The email. Requires to be an edu email",
          },
          password: {
            type: "string",
            description: "The password",
          },
        },
        required: [
          "email",
          "password",
        ],
        additionalProperties: false,
      },
      responses: {
        type: "object",
        properties: {
          "201": {
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "The generated token",
              },
            },
            required: [
              "token",
            ],
            additionalProperties: false,
            description: "Registration is success.",
          },
          "405": {
            type: "object",
            additionalProperties: false,
            description: "The email already exists.",
          },
        },
        required: [
          "201",
          "405",
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
