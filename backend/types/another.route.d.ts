export interface Headers {
  "H-Custom": string;
}

export interface Querystring {
  username: string;
  captcha?: string;
}

export interface Response {
  success: boolean;
}
