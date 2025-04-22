import nodemailer from "nodemailer";
import dotenv from "dotenv"
import path from "path";
import ejs from "ejs"

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})


const rednerEmailTemplate = async (templateName: string, data: Record<string, any>): Promise<string> => {

  const templatePath = path.join(
    process.cwd(),
    "apps",
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  )
  return ejs.renderFile(templatePath, data)
}


export const sendEmail = async (to: string, subject: string, templateName: string, data: Record<string, any>) => {
  try {
    const html = await rednerEmailTemplate(templateName, data);
    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    })
    return true;
  } catch (error) {
    console.error("Error sending email", error);
    return false;
  }
}
