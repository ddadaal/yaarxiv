import fastifyCorsPlugin from "fastify-cors";
import { jwtAuthPlugin } from "./auth";
import { mailPlugin } from "./mail";
import { ormPlugin } from "./orm";
import { fsStoragePlugin } from "./storage/fs";
import { swaggerPlugin } from "./swagger";
import { uploadPlugin } from "./upload";

export const plugins = [
  fastifyCorsPlugin,
  swaggerPlugin,
  uploadPlugin,
  ormPlugin,
  mailPlugin,
  jwtAuthPlugin,
  fsStoragePlugin,
];
