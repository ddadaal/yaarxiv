export const api = {
  url: "/",
  method: "GET",
} as const;

/** Home page api */
export interface Schema {
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
      },
      required: [
        "username",
      ],
      additionalProperties: false,
    },
    responses: {
      type: "object",
      properties: {
        "200": {
          type: "object",
          properties: {
            hello: {
              type: "string",
              description: "The user same as the input querystring",
            },
          },
          required: [
            "hello",
          ],
          additionalProperties: false,
          description: "Hello",
        },
      },
      required: [
        "200",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "querystring",
    "responses",
  ],
  additionalProperties: false,
  description: "Home page api",
};
// ======= Auto-generated JSON schema end =======