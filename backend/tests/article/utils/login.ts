
import { User } from "../../../src/entities/User";
import { genId } from "../../../src/utils/genId";
import { signUser } from "../../../src/utils/auth";
import { FastifyInstance } from "fastify";
import { EntityManager } from "mikro-orm";

export const normalUser1 = new User();
normalUser1.role = "user";
normalUser1.name = "normal1";
normalUser1.email = "normal1@user.com";
normalUser1.password = "normal1@user.com";
normalUser1.id = genId();

export const normalUser2 = new User();
normalUser2.role = "user";
normalUser2.name = "normal2";
normalUser2.email = "normal2@user.com";
normalUser2.password = "normal2@user.com";
normalUser2.id = genId();

export const adminUser = new User();
adminUser.role = "admin";
adminUser.name = "admin";
adminUser.email = "admin@user.com";
adminUser.password = "admin@user.com";
adminUser.id = genId();

export function login(fastify: FastifyInstance, user: User) {
  return { headers: { authorization: `bearer ${signUser(fastify, user)}` } };
}

export async function insertUserInfo(em: EntityManager) {
  const repo = em.getRepository(User);

  await repo.persist([normalUser1, normalUser2, adminUser]);
}
