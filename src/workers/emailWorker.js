const { Worker } = require("bullmq");
const nodemailer = require("nodemailer");

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { email, name } = job.data;

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Node API" <test@example.com>',
      to: email,
      subject: "Welcome",
      text: `Hello ${name}, welcome!`,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

worker.on("completed", () => {
  console.log("Email job completed");
});

worker.on("failed", (job, error) => {
  console.log("Job failed:", error.message);
});
