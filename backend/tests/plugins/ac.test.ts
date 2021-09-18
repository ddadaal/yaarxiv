import { FastifyInstance } from "fastify/types/instance";
import { InjectOptions, RouteHandlerMethod } from "fastify";
import { createTestServer } from "tests/utils/createTestServer";
import ms from "ms";
import { GeneratedTokenInfo } from "@/plugins/ac";
import MockDate from "mockdate";

let server: FastifyInstance;

const action = "action";
const payload = { test: "123" };
const validTime = "30min";

const now = Date.now();

beforeEach(() => {
  MockDate.set(now);
});

afterEach(async () => {
  await server.close();
  MockDate.reset();
});


async function prepare(handler: RouteHandlerMethod) {

  const testPath = "/testac";

  server = await createTestServer(async (s) => {
    s.register(async (s) => s.get(testPath, {
    }, handler));
  });

  return (options: InjectOptions) => server.inject({
    path: testPath,
    ...options,
  });
}

it("generates access token", async () => {
  const request = await prepare(async (req) => {
    return req.server.ac.generate(action, payload, validTime);
  });

  const resp = (await request({})).json() as GeneratedTokenInfo;
  expect(resp).toEqual({ token: expect.any(String), invalidAfter: now + ms(validTime)  });
});

it("gets payload of access token", async () => {
  const request = await prepare(async (req) => {
    const { token } = req.query as { token: string };

    const p = await req.server.ac.validate<typeof payload>(action, token);

    return { payload: p };
  });

  const { token } = server.ac.generate(action, payload, validTime);

  const resp = (await request({ query: { token } })).json();
  expect(resp).toEqual({ payload });
});

it("fails to access payload if action is not valid", async () => {
  const request = await prepare(async (req) => {
    const { token } = req.query as { token: string };

    const p = await req.server.ac.validate<typeof payload>(action + "another", token);

    return { payload: p };
  });

  const { token } = server.ac.generate(action, payload, validTime);

  const resp = (await request({ query: { token } })).json();
  expect(resp.payload).toBeUndefined();

});

it("fails to access payload if token is invalid", async () => {
  const request = await prepare(async (req) => {

    MockDate.set(now + validTime + 1000);

    const { token } = req.query as { token: string };

    const p = await req.server.ac.validate<typeof payload>(action, token);

    return { payload: p };
  });

  const { token } = server.ac.generate(action, payload, validTime);

  const resp = (await request({ query: { token } })).json();
  expect(resp.payload).toBeUndefined();

});
