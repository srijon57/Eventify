import nodemailer from "nodemailer"

export const sendEmail = async (to, subject, Text, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER_EVENT,
            pass: process.env.EMAIL_PASS_EVENT
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER_EVENT,
        to,
        subject,
        text: Text,
        html
    }

    await transporter.sendMail(mailOptions)
}

// okid mznn naqz vwyv