import { Controller, Post, Body, UploadedFile, UseInterceptors, } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
@Controller('notification')
export class NotificationController {
    @Post('send-email')
    @UseInterceptors(FileInterceptor('file'))
    async sendEmail(
        @Body() body: { to: string; subject: string; text: string; },
        @UploadedFile() file?: Express.Multer.File,) {
        const { to, subject, text } = body;
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_USER_PASSWORD,
            },
        });
        try {
            // Test the connection
            await transporter.verify();
            console.log('SMTP server is ready to take our messages');
        }
        catch (error) {
            console.error('Error connecting to SMTP server:', error);
            return { success: false, error: 'Failed to connect to SMTP server' };
        }
        // Mail options
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments: file
                ? [
                    {
                        filename: file.originalname,
                        content: file.buffer,
                    },
                ]
                : [],
        };

        // Send mail
        try {
            const result = await transporter.sendMail(mailOptions);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
