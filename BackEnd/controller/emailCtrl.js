const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.MP,
      },
    });
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <abc@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.htm,
    });
    console.log("Message sent: %s", info.messageId);
    if (res) {
      res.json({ success: true });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    if (res) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

module.exports = sendEmail;
