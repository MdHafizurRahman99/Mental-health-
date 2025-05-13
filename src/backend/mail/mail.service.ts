import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    // Create a nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("MAIL_HOST", "smtp.gmail.com"),
      port: this.configService.get<number>("MAIL_PORT", 587),
      secure: this.configService.get<boolean>("MAIL_SECURE", false),
      auth: {
        user: this.configService.get<string>("MAIL_USER"),
        pass: this.configService.get<string>("MAIL_PASSWORD"),
      },
    })
  }

  /**
   * Sends a verification email to a newly registered user
   * @param email - User's email address
   * @param name - User's name
   * @param token - Verification token
   */
  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const appUrl = this.configService.get<string>("APP_URL", "http://localhost:3000")
    const verificationUrl = `${appUrl}/users/verify/${token}`

    await this.transporter.sendMail({
      from: `"${this.configService.get<string>("MAIL_FROM_NAME", "App Team")}" <${this.configService.get<string>("MAIL_FROM_ADDRESS", "noreply@example.com")}>`,
      to: email,
      subject: "Please verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering with our application. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>If you did not create an account, no further action is required.</p>
          <p>If you're having trouble clicking the button, copy and paste the following link into your web browser:</p>
          <p>${verificationUrl}</p>
          <p>Regards,<br>The App Team</p>
        </div>
      `,
    })
  }
}
