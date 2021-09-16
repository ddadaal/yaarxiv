import { accessTokenPlugin } from "@/plugins/accessToken";
import { storagePlugin } from "@/plugins/storage";
import fastifyCorsPlugin from "fastify-cors";
import { jwtAuthPlugin } from "./auth";
import { mailPlugin } from "./mail";
import { ormPlugin } from "./orm";
import { swaggerPlugin } from "./swagger";
import { uploadPlugin } from "./upload";

export const plugins = [
  fastifyCorsPlugin,
  swaggerPlugin,
  uploadPlugin,
  ormPlugin,
  mailPlugin,
  jwtAuthPlugin,
  storagePlugin,
  accessTokenPlugin,
];
