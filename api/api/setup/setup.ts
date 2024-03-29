import { ApiProps } from "../utils/apiProps";
import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";

export interface NewAdminInfo {
  /**
   * The password for the first admin.
   */
  password: string;
  /**
   * The email for the first addmin.
   * @format email
   */
  email: string;
}

/** Setup the system. */
export interface SetupSchema {
  body: {
    admin: NewAdminInfo;
  };
  responses: {
    204: null;
    /** The system has been setup. */
    409: ErrorResponse<"SYSTEM_ALREADY_SETUP">;
  }
}

export const props: ApiProps = {

};

export const endpoint = {
  method: "POST",
  url: "/setup",
} as Endpoint<SetupSchema>;
