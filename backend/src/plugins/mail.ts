import fp from "fastify-plugin";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { config } from "@/core/config";
import { MailOptions } from "nodemailer/lib/json-transport";

declare module "fastify" {
  // @ts-ignore
  interface FastifyInstance {
    sendMail: (options: MailOptions, ignoreError?: boolean) => Promise<undefined>;
  }
}


export const mailPlugin = fp(async (fastify) => {

  const logger = fastify.log.child({ plugin: "mail" });

  if (config.mail) {

    const { from, ignoreError, ...mailConfig } = config.mail;
    const mail = createTransport(mailConfig);

    fastify.decorate("sendMail", async (
      { subject, ...rest }: Mail.Options,
      callIgnoreError?: boolean,
    ) => {
      return mail.sendMail({
        from: `${from} <${mailConfig.auth?.user}>`,
        subject: `${subject} - yaarxiv`,
        ...rest,
      }).catch((e) => {
        logger.error(`Error sending email to ${rest.to}. Error is`);
        logger.error(e);

        const shouldIgnoreError =
          callIgnoreError !== undefined
            ? callIgnoreError
            : ignoreError;

        if (!shouldIgnoreError) {
          throw e;
        }
      });
    });

    fastify.addHook("onClose", async () => {
      mail.close();
    });
  } else {
    fastify.decorate("sendMail", (mailOptions: Mail.Options) => {
      logger.info("Attempted to send email, but mail is not enabled. Args: \n%o", mailOptions);
    });
  }
});
