export const endpoint = {
  url: "/user",
  method: "POST" ,
} as const;

export const summary = "Register.";

/** Register */
export interface RegisterSchema {
  body: {
    /**
     * The email.
     * Requires to be an edu email.
     * @format email
     */
    email: string;
    /** The password */
    password: string;
  };
  responses: {
    /** Registration is success. */
    201: {
      /** The generated token */
      token: string;
      /** The initial name of the newly-created user. */
      name: string;
      /** User id */
      userId: string;
    },
    /** The email already exists. */
    405: {

    }
  }
}

