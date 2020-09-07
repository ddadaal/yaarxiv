export const endpoint = {
  url: "/dashboard/profile",
  method: "PATCH",
} as const;

export const summary = "Change user's profile.";

/** Change the profile of the current logged in user. */
export interface ChangeProfileSchema {

  body: {
    /** New name */
    name?: string;
    /**
     * New email.
     * @format email
     */
    email?: string;
  };
  responses: {
    /** The profile has been updated. */
    200: {
    };
  }
}
