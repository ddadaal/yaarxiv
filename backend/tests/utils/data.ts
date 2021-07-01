import { FastifyInstance } from "fastify";
import { encryptSync } from "@/utils/bcrypt";
import { User, UserRole } from "@/entities/User";
import { wrap } from "@mikro-orm/core";

export interface MockUsers {
  normalUser1: User;
  normalUser2: User;
  adminUser: User;
}

export const normalUser1OriginalPassword = "normal1@user.com";
export const normalUser2OriginalPassword = "normal2@user.com";
export const adminUserOriginalPassword = "admin@user.com";

export async function createMockUsers(server: FastifyInstance): Promise<MockUsers> {
  const normalUser1 = new User();
  normalUser1.role = UserRole.User;
  normalUser1.name = "normal1";
  normalUser1.email = "normal1@user.com";
  normalUser1.password = encryptSync(normalUser1OriginalPassword);

  const normalUser2 = new User();
  normalUser2.role = UserRole.User;
  normalUser2.name = "normal2";
  normalUser2.email = "normal2@user.com";
  normalUser2.password = encryptSync(normalUser2OriginalPassword);

  const adminUser = new User();
  adminUser.role = UserRole.Admin;
  adminUser.name = "admin";
  adminUser.email = "admin@user.com";
  adminUser.password = encryptSync(adminUserOriginalPassword);

  await server.orm.em.persistAndFlush([normalUser1, normalUser2, adminUser]);

  return { normalUser1, normalUser2, adminUser };
}

export async function reloadEntity(entity: any) {
  await wrap(entity).init();
}

export async function reloadEntities(entities: any[]) {
  await Promise.all(entities.map((e) => reloadEntity(e)));
}

export async function reloadUsers(users: MockUsers) {
  await reloadEntities(Object.values(users));
}
