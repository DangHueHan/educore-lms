import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendLoginToken(email: string, token: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "EDUCORE Login Token",
      html: `
        <h2>Đăng nhập EDUCORE</h2>

        <p>Copy token bên dưới:</p>

        <div style="
          font-size:20px;
          font-weight:bold;
          background:#f3f4f6;
          padding:12px;
          border-radius:8px;
          word-break:break-all;
        ">
          ${token}
        </div>

        <p>Token có hiệu lực trong 15 phút.</p>
      `,
    });
  }
}