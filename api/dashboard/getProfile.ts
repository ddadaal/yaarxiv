export const endpoint = {
  url: "/dashboard/profile",
  method: "GET",
} as const;

/** Get the profile of current logged in user. */
export interface DashboardGetProfileSchema {
  responses: {
    /** Returns the profile of current logged in user. */
    200: {
      /** The name of the user. */
      name: string;
      /** The email of the user. */
      email: string;
      /** The id of the user. */
      userId: string;
    }
  }
}
