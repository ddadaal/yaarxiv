export interface Headers {
  "H-Custom": string;
}

export interface Querystring {
  username: string;
  password: string;
  captcha?: string;
}

export interface Response {
  success: boolean;
  status: 200 | 403 | 500;
}
