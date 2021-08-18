import * as api from "yaarxiv-api/api/auth/login";
import { route } from "@/core/route";
import { User } from "@/entities/User";
import { signUser } from "@/plugins/auth";
import { toRef } from "@/utils/orm";
import { EmailValidationToken } from "@/entities/EmailValidationToken";
import { genToken } from "@/utils/genId";
import { sendEmailValidation } from "@/emails/emailValidation";
import createError from "fastify-error";

const CredentialNotValidError = createError("CREDENTIAL_NOT_VALID", "The password is not correct.", 401);

const UserNotValidatedEmailSentError = createError(
  "USER_NOT_VALIDATED_EMAIL_SENT",
  "The user is not validated. A new validation email has been sent.",
  403);

const UserNotValidatedEmailNotSentError = createError(
  "USER_NOT_VALIDATED_EMAIL_NOT_SENT",
  "The user is not validated. Check email for validation",
  403);

export const loginRoute = route(
  api, "LoginSchema",
  async (req, fastify) => {
    const { id, password } = req.query;

    const user = await req.em.findOne(User, { email: id });

    if (!user || !await user.passwordMatch(password)) {
      throw new CredentialNotValidError();
    }

    const now = new Date();

    let send: boolean = false;

    if (!user.validated) {
      if (!user.emailValidation) {
        user.emailValidation = toRef(new EmailValidationToken(user, now));
        send = true;
      } else {
        const validation = await user.emailValidation.load();

        if (validation.timeout(now)) {
          validation.token = genToken();
          validation.time = now;
          validation.lastSent = now;
          send = true;
        } else if (validation.shouldResend(now)) {
          validation.lastSent = now;
          send = true;
        }
      }

      await req.em.flush();

      if (send) {
        sendEmailValidation(fastify, user.email, user.emailValidation!.getProperty("token"));
        throw new UserNotValidatedEmailSentError();
      } else {
        throw new UserNotValidatedEmailNotSentError();
      }
    }

    return {
      200: {
        token: signUser(fastify, user),
        name: user.name,
        role: user.role,
        userId: user.id,
      },
    };

  });

