const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config(); // load .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 📥 Endpoint to receive form submission
app.post("/api/apply", async (req, res) => {
  const formData = req.body;

  console.log("📥 Received application:", formData); // ✅ Check if request arrives

  const msg = {
    to: formData.email,
    from: "greenvalleyproject01@gmail.com", // must match verified sender
    subject: "Green Valley School - Application Received",
    html: `
      <p>Dear ${formData.parentName},</p>
      <p>Thank you for applying to Green Valley School on behalf of ${formData.studentName}.</p>
      <p>We have received your application and will be in touch shortly.</p>
      <p><strong>Grade Applied:</strong> ${formData.grade}</p>
      <br />
      <p>Best regards,<br/>Green Valley School Admissions Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent successfully");
    res.status(200).json({ message: "Application submitted and email sent." });
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error);
    res.status(500).json({ message: "Failed to send confirmation email." });
  }
});
// 📡 Endpoint to check server status
app.get("/api/status", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly." });
});
// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});