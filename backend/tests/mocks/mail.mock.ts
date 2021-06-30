import { delay } from "@/utils/delay";
import fp from "fastify-plugin";

export const mockMailPlugin = fp(async (fastify) => {
  fastify.decorate("sendMail", jest.fn(() => delay(500)));
});
