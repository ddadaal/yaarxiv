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
  const normalUser1 = new User({
    role: UserRole.User,
    name: "normal1",
    email: "normal1@user.com",
    password: encryptSync(normalUser1OriginalPassword),
  });

  const normalUser2 = new User({
    role: UserRole.User,
    name: "normal2",
    email: "normal2@user.com",
    password: encryptSync(normalUser2OriginalPassword),
  });

  const adminUser = new User({
    role: UserRole.Admin,
    name: "admin",
    email: "admin@user.com",
    password: encryptSync(adminUserOriginalPassword),
  });

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
