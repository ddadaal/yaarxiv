import { customAlphabet } from "nanoid";

// https://zelark.github.io/nano-id-cc/ says at a gen rate of 1 per second,
// such alphabet and length will need 255 years to have a 1% probability of at least one collision.
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  12,
);

export function genId(): string {
  return nanoid();
}

export function genToken(): string {
  return nanoid();
}
