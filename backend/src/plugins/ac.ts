import fp from "fastify-plugin";
import ms from "ms";

export interface GeneratedTokenInfo {
  token: string;
  invalidAfter: number;
}

export interface AccessControlHelpers {
  generate: (action: string, payload: unknown, expiresIn: string) => GeneratedTokenInfo;
  validate: <T>(action: string, token: string) => Promise<T | undefined>;
}

declare module "fastify" {
  interface FastifyInstance {
    ac: AccessControlHelpers;
  }
}

interface AccessTokenInfo {
  action: string;
  payload: unknown;
}

export const accessControlPlugin = fp(async (fastify) => {
  const generate: AccessControlHelpers["generate"] = (action, payload, expiresIn) => {
    const token = fastify.jwt.sign({ action, payload } as AccessTokenInfo, { expiresIn });

    return { token, invalidAfter: Date.now() + ms(expiresIn) };
  };

  const validate: AccessControlHelpers["validate"] = async <T>(action: string, token: string) => {
    return await new Promise<T | undefined>
    ((res) => fastify.jwt.verify(token, (err, decoded: AccessTokenInfo) => {
      if (err) {
        res(undefined);
        return;
      }
      if (decoded.action !== action) {
        res(undefined);
        return;
      }
      res(decoded.payload as T);
    }));
  };

  fastify.decorate("ac", { generate, validate });
});

