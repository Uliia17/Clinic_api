import fs from "node:fs/promises";
import path from "node:path";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { config } from "../configs/config";
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD,
            },
        });
    }
    async _renderTemplate(templateName, context) {
        const layoutSource = await fs.readFile(path.join(process.cwd(), "src", "templates", "base.hbs"), "utf8");
        const layoutTemplate = handlebars.compile(layoutSource);
        const templateSource = await fs.readFile(path.join(process.cwd(), "src", "templates", `${templateName}.hbs`), "utf8");
        const childTemplate = handlebars.compile(templateSource);
        const childHtml = childTemplate(context);
        return layoutTemplate({ body: childHtml });
    }
    async sendEmail(to, subject, templateName, context) {
        await this.transporter.sendMail({
            to,
            subject,
            html: await this._renderTemplate(templateName, context),
        });
    }
}
export const emailService = new EmailService();
