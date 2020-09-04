import bcrypt from "bcryptjs";
import { config } from "./config";


export async function encrypt(text: string): Promise<string> {
  return bcrypt.hash(text, config.bcryptSaltLength);
}

export async function compare(text: string, actual: string): Promise<boolean> {
  return bcrypt.compare(text, actual);
}
