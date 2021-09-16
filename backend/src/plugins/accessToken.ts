import fp from "fastify-plugin";
import ms from "ms";

export interface GeneratedTokenInfo {
  token: string;
  invalidAfter: number;
}

export interface AccessTokenHelpers {
  generate: (action: string, payload: unknown, expiresIn: string) => GeneratedTokenInfo;
  validate: <T>(action: string, token: string) => Promise<T | undefined>;
}

declare module "fastify" {
  interface FastifyInstance {
    accessToken: AccessTokenHelpers;
  }
}

interface AccessTokenInfo {
  action: string;
  payload: unknown;
}

export const accessTokenPlugin = fp(async (fastify) => {
  const generate: AccessTokenHelpers["generate"] = (action, payload, expiresIn) => {
    const token = fastify.jwt.sign({ action, payload } as AccessTokenInfo, { expiresIn });

    return { token, invalidAfter: Date.now() + ms(expiresIn) };
  };

  const validate: AccessTokenHelpers["validate"] = async <T>(action: string, token: string) => {
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

  fastify.decorate("accessToken", { generate, validate });
});

