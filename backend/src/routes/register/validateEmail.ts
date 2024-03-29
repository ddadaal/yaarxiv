import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/register/validateEmail";
import { EmailValidationToken } from "@/entities/EmailValidationToken";

export const validateEmailRoute = route(
  api, "ValidateEmailSchema",
  async (req) => {
    const { token } = req.body;

    const validation = await req.em.findOne(EmailValidationToken, { token });

    if (!validation) {
      return { "403": { code: "TOKEN_NOT_VALID" } } as const;
    }

    req.em.remove(validation);

    if (validation.timeout()) {
      await req.em.flush();
      return { "403": { code: "TOKEN_NOT_VALID" } } as const;
    }

    (await validation.user.load()).validated = true;
    await req.em.flush();

    return { 201: {} };
  },
);
