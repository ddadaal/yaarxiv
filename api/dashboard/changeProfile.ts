export const endpoint = {
  url: "/dashboard/profile",
  method: "PATCH",
} as const;

/** Change the profile of the current logged in user. */
export interface ChangeProfileSchema {

  body: {
    /** New name */
    name?: string;

    /** New email. */
    email?: string;
  };
  responses: {
    /** The profile has been updated. */
    201: {
    };
  }
}
