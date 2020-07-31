export interface Querystring {
  /** The username of the string */
  username: string;

  /** The password of the user */
  password: string;
}

/** Response when the login succeed */
export interface SuccessResponse {
  /** Token returned */
  token: string;
}

/** Response when the login fails */
export interface FailedResponse {
  /** The reason why failed */
  reason: 403 | "string";
}
