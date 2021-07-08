import fastifyCorsPlugin from "fastify-cors";
import { jwtAuthPlugin } from "./auth";
import { mailPlugin } from "./mail";
import { ormPlugin } from "./orm";
import { staticPlugin } from "./static";
import { swaggerPlugin } from "./swagger";
import { uploadPlugin } from "./upload";

export const plugins = [
  fastifyCorsPlugin,
  swaggerPlugin,
  staticPlugin,
  uploadPlugin,
  ormPlugin,
  mailPlugin,
  jwtAuthPlugin,
];
