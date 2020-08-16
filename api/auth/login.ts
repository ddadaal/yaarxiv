export const api = {
  url: "/login",
  method: "GET" ,
} as const;

/** Login */
export interface Schema {
  querystring: {
    /** The username */
    username: string;
    /** The password */
    password: string;
    /** The captcha if present */
    captcha?: string;
  };
  responses: {
    /** The request is success */
    200: {
      /** The generated token */
      token: string;
    },
    /** The request fails */
    403: {
      reason?: number;
    }
  }
}

// ======= Auto-generated JSON schema begin =======
export const schema = {
  type: "object",
  properties: {
    querystring: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "The username",
        },
        password: {
          type: "string",
          description: "The password",
        },
        captcha: {
          type: "string",
          description: "The captcha if present",
        },
      },
      required: [
        "username",
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
          },
          required: [
            "token",
          ],
          additionalProperties: false,
          description: "The request is success",
        },
        "403": {
          type: "object",
          properties: {
            reason: {
              type: "number",
            },
          },
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
};
// ======= Auto-generated JSON schema end =======