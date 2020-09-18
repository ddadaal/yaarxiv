import { User } from "../../../src/entities/User";
import { signUser } from "../../../src/plugins/auth";
import { FastifyInstance } from "fastify";
import http from "http";
import { encryptSync } from "@/utils/bcrypt";
import { EntityManager } from "@mikro-orm/core";

export const normalUser1 = new User();
export const normalUser1OriginalPassword = "normal1@user.com";
normalUser1.role = "user";
normalUser1.name = "normal1";
normalUser1.email = "normal1@user.com";
normalUser1.password = encryptSync(normalUser1OriginalPassword);
normalUser1.id = "1";

export const normalUser2 = new User();
export const normalUser2OriginalPassword = "normal2@user.com";
normalUser2.role = "user";
normalUser2.name = "normal2";
normalUser2.email = "normal2@user.com";
normalUser2.password = encryptSync(normalUser2OriginalPassword);
normalUser2.id = "2";

export const adminUser = new User();
export const adminUserOriginalPassword = "admin@user.com";
adminUser.role = "admin";
adminUser.name = "admin";
adminUser.email = "admin@user.com";
adminUser.password = encryptSync(adminUserOriginalPassword);
adminUser.id = "3";

export function login(
  fastify: FastifyInstance,
  user: User,
  extraHeaders?: http.IncomingHttpHeaders | http.OutgoingHttpHeaders) {
  return {
    headers: {
      authorization: `bearer ${signUser(fastify, user)}`,
      ...extraHeaders,
    },
  };
}
function clone<T>(orig: T): T {
  return Object.assign(Object.create( Object.getPrototypeOf(orig)), orig);
}

export async function insertUserInfo(em: EntityManager) {
  // make a copy of User object
  await em.persistAndFlush([normalUser1, normalUser2, adminUser].map(clone));
}
