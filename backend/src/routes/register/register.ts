import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/register/register";
import { User, UserRole } from "@/entities/User";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { EmailValidationToken } from "@/entities/EmailValidationToken";

import { sendEmailValidation } from "@/emails/emailValidation";
import createError from "fastify-error";

const EmailAlreadyExistsError = createError("EMAIL_ALREADY_EXISTS", "The email already exists", 405);

export const registerUserRoute = route(
  api, "RegisterSchema",
  async (req, fastify) => {
    const user = new User({
      email: req.body.email,
      name: req.body.email.split("@")[0],
      role: UserRole.User,
    });

    await user.setPassword(req.body.password);

    // create email validation
    const validation = new EmailValidationToken(user);

    try {
      await req.em.persistAndFlush([user, validation]);
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        if (e.message.startsWith("insert into `user`")) {
          throw new EmailAlreadyExistsError();
        }
      }
      throw e;
    }

    // send activation email
    sendEmailValidation(fastify, req.body.email, validation.token);

    return { 201: {} };
  },
);
