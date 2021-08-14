import { config } from "@/core/config";
import { getUrlFromTemplate } from "@/utils/url";
import { FastifyInstance } from "fastify";

export const sendEmailValidation = async (fastify: FastifyInstance, email: string, token: string) => {
  // send activation email

  const url = getUrlFromTemplate(config.emailValidation.pathnameTemplate, token);

  await fastify.sendMail({
    to: email,
    subject: "邮箱验证",
    html: `
        <p>
          感谢您注册第三届全国高校数据驱动创新研究大赛，请点击以下链接，验证您的邮箱。
        </p>

        <p>
          <a href="${url}">点击验证邮箱</a>
        </p>

        <p>
        如果您的电子邮箱客户端不支持HTML，您也可以访问以下链接：
        </p>

        <p>
        ${url}
        </p>

        <p>
        为保证您的账户安全，激活链接将在${config.emailValidation.timeoutSeconds / 60}分钟后失效。
        </p>

        <p>
        感谢您的支持！
        </p>
      `,
  });
};
