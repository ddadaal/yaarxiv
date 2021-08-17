import { config } from "@/core/config";
import { getUrlFromTemplate } from "@/utils/url";
import { FastifyInstance } from "fastify";

export const sendResetPassword = async (fastify: FastifyInstance, email: string, token: string) => {
  const url = getUrlFromTemplate(config.resetPassword.resetPagePathnameTemplate, token);

  await fastify.sendMail({
    to: email,
    subject: "重置密码",
    html: `
        <p>
          您申请了重置您的yaarxiv账号 ${email} 的密码。
        </p>

        <p>
          <a href="${url}">点击这里重置密码</a>
        </p>

        <p>
        如果您的电子邮箱客户端不支持HTML，您也可以访问以下链接：
        </p>

        <p>
        ${url}
        </p>

        <p>
        为保证您的账户安全，此链接将在${config.resetPassword.tokenValidTimeSeconds / 60}分钟后失效。
        </p>

        <p>
        感谢您的支持！
        </p>
      `,
  });
};
