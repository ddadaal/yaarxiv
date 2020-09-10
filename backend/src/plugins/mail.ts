import fp from "fastify-plugin";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { config } from "@/utils/config";

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    mail: Mail;
  }
}


export const mailPlugin = fp(async (fastify) => {

  const mail = createTransport(config.mail);

  fastify
    .decorate("mail", mail)
    .addHook("onClose", async () => {
      mail.close();
    });
});


