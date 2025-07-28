// Required dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { admin, db } = require("./config/firebase-config");
const crypto = require("crypto");
const {
  sendApplicationEmails,
  updateApplicationStatus,
} = require("./utils/emailHandler");
const logger = require("./utils/logger");
const sgMail = require("@sendgrid/mail");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Import routes
const adminRoutes = require("./routes/admin");

// Use routes
app.use("/api/admin", adminRoutes);

// Admin middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Authentication credentials not provided",
      });
    }

    // Check admin in Firestore
    const adminSnapshot = await db
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (adminSnapshot.empty) {
      logger.warning("Failed admin login attempt", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const adminDoc = adminSnapshot.docs[0];
    const adminData = adminDoc.data();

    // Verify password using Firebase Admin SDK
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      // Additional checks if needed
      if (!adminData.isActive) {
        return res.status(403).json({
          success: false,
          message: "Admin account is inactive",
        });
      }
    } catch (error) {
      logger.error("Admin authentication error", {
        error: error.message,
        email,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Add admin data to request
    req.admin = {
      id: adminDoc.id,
      email: adminData.email,
      name: adminData.name,
    };

    logger.info("Admin authenticated successfully", { email });
    next();
  } catch (error) {
    logger.error("Admin middleware error", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin Routes
app.get(
  "/api/admin/pending-applications",
  authenticateAdmin,
  async (req, res) => {
    try {
      const studentsSnapshot = await db
        .collection("students")
        .orderBy("createdAt", "desc")
        .where("applicationStatus", "==", "pending")
        .get();

      const applications = [];

      for (const doc of studentsSnapshot.docs) {
        const studentData = doc.data();
        const parentDoc = await db
          .collection("parents")
          .doc(studentData.parentRef)
          .get();
        const parentData = parentDoc.data();

        applications.push({
          studentId: studentData.studentId,
          studentName: studentData.studentName,
          grade: studentData.grade,
          submittedAt: studentData.createdAt.toDate(),
          parentName: parentData.name,
          parentEmail: parentData.email,
        });
      }

      res.json({ applications });
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Admin login endpoint
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check admin in Firestore
    const adminSnapshot = await db
      .collection("admins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (adminSnapshot.empty) {
      logger.warning("Admin login failed - user not found", { email });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    try {
      // Verify with Firebase Auth
      const userCredential = await admin.auth().getUserByEmail(email);
      const adminData = adminSnapshot.docs[0].data();

      logger.info("Admin logged in successfully", { email });
      res.json({
        success: true,
        admin: {
          email: adminData.email,
          name: adminData.name,
        },
      });
    } catch (error) {
      logger.error("Admin login error", { error: error.message, email });
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    logger.error("Admin login error", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Application decision endpoint
<<<<<<< HEAD
app.post('/api/admin/decision', authenticateAdmin, async (req, res) => {
    const { studentId, applicationId, approved } = req.body;
    if ((!studentId && !applicationId) || approved === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Student ID or Application ID and decision are required'
        });
    }
    try {
        // Lookup student by studentId or applicationId (Firestore doc ID)
        let studentDoc, studentData;
        if (studentId) {
            const studentsSnapshot = await db.collection('students')
                .where('studentId', '==', studentId)
                .limit(1)
                .get();
            if (studentsSnapshot.empty) {
                logger.warning('Application decision failed - student not found by studentId', { studentId });
                return res.status(404).json({
                    success: false,
                    message: 'Application not found (studentId)'
                });
            }
            studentDoc = studentsSnapshot.docs[0];
            studentData = studentDoc.data();
        } else {
            studentDoc = await db.collection('students').doc(applicationId).get();
            if (!studentDoc.exists) {
                logger.warning('Application decision failed - student not found by applicationId', { applicationId });
                return res.status(404).json({
                    success: false,
                    message: 'Application not found (applicationId)'
                });
            }
            studentData = studentDoc.data();
        }
        // Get parent data
        const parentDoc = await db.collection('parents').doc(studentData.parentRef).get();
        if (!parentDoc.exists) {
            logger.error('Parent document not found', { studentId: studentData.studentId, parentRef: studentData.parentRef });
            return res.status(404).json({
                success: false,
                message: 'Parent information not found'
            });
        }
        const parentData = parentDoc.data();
        // Validate email fields
        if (!studentData.studentEmail || !parentData.email) {
            logger.error('Missing email fields for student or parent', {
                studentId: studentData.studentId,
                studentEmail: studentData.studentEmail,
                parentEmail: parentData.email
            });
            return res.status(400).json({
                success: false,
                message: 'Student or parent email address missing in records.'
            });
        }
        // Update application status (student & parent)
        try {
            await updateApplicationStatus(studentDoc, studentData.parentRef, approved);
        } catch (err) {
            logger.error('Error updating application status in Firestore', {
                error: err.message,
                studentId: studentData.studentId
            });
            return res.status(500).json({
                success: false,
                message: 'Failed to update application status in Firestore.'
            });
        }
        // Send emails (approval/rejection)
        try {
            await sendApplicationEmails(studentData, parentData, approved);
        } catch (err) {
            logger.error('Error sending application decision emails', {
                error: err.message,
                studentId: studentData.studentId
            });
            return res.status(500).json({
                success: false,
                message: 'Application status updated, but failed to send notification emails.'
            });
        }
        logger.info('Application processed successfully', {
            studentId: studentData.studentId,
            applicationId: studentDoc.id,
            decision: approved ? 'approved' : 'rejected',
            adminEmail: req.admin.email
        });
        res.json({
            success: true,
            message: `Application ${approved ? 'approved' : 'rejected'} successfully`,
            studentId: studentData.studentId,
            applicationId: studentDoc.id
        });
    } catch (error) {
        logger.error('Error processing application decision', {
            error: error.message,
            studentId: studentId,
            applicationId: applicationId,
            adminEmail: req.admin?.email
        });
        res.status(500).json({
            success: false,
            message: 'Failed to process application decision'
        });
=======
app.post("/api/admin/decision", authenticateAdmin, async (req, res) => {
  const { studentId, approved } = req.body;

  if (!studentId || approved === undefined) {
    return res.status(400).json({
      success: false,
      message: "Student ID and decision are required",
    });
  }

  try {
    // Find student document
    const studentsSnapshot = await db
      .collection("students")
      .where("studentId", "==", studentId)
      .limit(1)
      .get();

    if (studentsSnapshot.empty) {
      logger.warning("Application decision failed - student not found", {
        studentId,
      });
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const studentDoc = studentsSnapshot.docs[0];
    const studentData = studentDoc.data();

    // Get parent data
    const parentDoc = await db
      .collection("parents")
      .doc(studentData.parentRef)
      .get();
    if (!parentDoc.exists) {
      logger.error("Parent document not found", {
        studentId,
        parentRef: studentData.parentRef,
      });
      return res.status(404).json({
        success: false,
        message: "Parent information not found",
      });
>>>>>>> 376e21c52510eae5b7ae3ff520f1b7080bfcf543
    }
    const parentData = parentDoc.data();

    // Update application status
    await updateApplicationStatus(studentDoc, studentData.parentRef, approved);

    // Send emails
    await sendApplicationEmails(studentData, parentData, approved);

    logger.info("Application processed successfully", {
      studentId,
      decision: approved ? "approved" : "rejected",
      adminEmail: req.admin.email,
    });

    res.json({
      success: true,
      message: `Application ${approved ? "approved" : "rejected"} successfully`,
      studentId,
    });
  } catch (error) {
    logger.error("Error processing application decision", {
      error: error.message,
      studentId,
      adminEmail: req.admin.email,
    });
    res.status(500).json({
      success: false,
      message: "Failed to process application decision",
    });
  }
});

// ✅ Routes
app.post("/api/apply", async (req, res) => {
  const formData = req.body;

  // Generate unique IDs and codes
  const studentId = "S" + crypto.randomBytes(3).toString("hex").toUpperCase();
  const studentActivationCode = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();
  const parentId = "P" + crypto.randomBytes(3).toString("hex").toUpperCase();
  const parentActivationCode = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  console.log("📥 Received application:", formData);
  console.log("👨‍🎓 Generated student ID:", studentId);
  console.log("🔑 Generated student activation code:", studentActivationCode);
  console.log("👤 Generated parent ID:", parentId);
  console.log("🔑 Generated parent activation code:", parentActivationCode);

  // Validate required fields
  const requiredFields = ["studentName", "studentEmail", "parentName", "email"];
  for (const field of requiredFields) {
    if (!formData[field]) {
      return res.status(400).json({
        message: `Missing required field: ${field}`,
      });
    }
  }

  try {
    // Create parent document in Firestore
    const parentRef = await db.collection("parents").add({
      parentId: parentId,
      name: formData.parentName,
      email: formData.email,
      phone: formData.phone,
      activationCode: parentActivationCode,
      isActive: false,
      applicationStatus: "pending",
      credentialsSent: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Store student data in Firestore
    const studentRef = await db.collection("students").add({
      studentId: studentId,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      activationCode: studentActivationCode,
      isActive: false,
      applicationStatus: "pending",
      credentialsSent: false,
      // Academic information
      grade: formData.grade,
      previousSchool: formData.previousSchool,
      previousGrades: formData.previousGrades,
      // Personal information
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      extracurriculars: formData.extracurriculars,
      // Emergency information
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      medicalConditions: formData.medicalConditions,
      // Application specific
      whyGreenValley: formData.whyGreenValley,
      additionalInfo: formData.additionalInfo,
      // Parent reference
      parentId: parentId,
      parentRef: parentRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("💾 Stored in Firestore with IDs:", {
      parentRef: parentRef.id,
      studentRef: studentRef.id,
    });

    // Prepare email messages
    const parentMsg = {
      to: formData.email,
      from: DEFAULT_FROM,
      subject: "Green Valley School Application Received",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
      html: `
        <p>Dear ${formData.parentName},</p>
        <p>Thank you for applying to Green Valley School on behalf of ${formData.studentName}.</p>
        <p>We have received your application for Grade ${formData.grade} and our admissions team will review it shortly.</p>
        <h3>Next Steps</h3>
        <ol>
          <li>Our admissions team will review your application</li>
          <li>You will receive an email with the application decision</li>
          <li>If accepted, you will receive separate login credentials for both parent and student portals</li>
        </ol>
        <p>We appreciate your interest in Green Valley School and will contact you soon.</p>
        <br />
        <p>Best regards,<br/>Green Valley School Admissions Team</p>
      `,
    };

    const studentMsg = {
      to: formData.studentEmail,
      from: DEFAULT_FROM,
      subject: "Green Valley School Application Received",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
      html: `
        <h1>Hello ${formData.studentName}!</h1>
        <p>Thank you for applying to Green Valley School. Your application has been received and will be reviewed by our admissions team.</p>
        <p>Once your application has been reviewed, we will send you:</p>
        <ul>
          <li>The application decision</li>
          <li>If accepted, your Student Portal login credentials</li>
          <li>Information about next steps</li>
        </ul>
        <p>We look forward to reviewing your application.</p>
      `,
    };

    try {
      // Send parent email
      console.log("📧 Attempting to send parent email...");
      const [parentResponse] = await sgMail.send(parentMsg);

      if (parentResponse && parentResponse.statusCode === 202) {
        console.log("✅ Parent email sent successfully");
        await parentRef.update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        throw new Error(
          `Parent email failed with status: ${
            parentResponse?.statusCode || "unknown"
          }`
        );
      }

      // Send student email
      console.log("📧 Attempting to send student email...");
      const [studentResponse] = await sgMail.send(studentMsg);

      if (studentResponse && studentResponse.statusCode === 202) {
        console.log("✅ Student email sent successfully");
        await studentRef.update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        throw new Error(
          `Student email failed with status: ${
            studentResponse?.statusCode || "unknown"
          }`
        );
      }

      console.log("✉️ All emails sent successfully:", {
        parentEmail: parentResponse.statusCode,
        studentEmail: studentResponse.statusCode,
      });

      return res.status(200).json({
        message:
          "Application submitted successfully. Check your email for confirmation.",
        studentRef: studentRef.id,
        parentRef: parentRef.id,
      });
    } catch (emailError) {
      console.error("📧 Email sending error:", emailError);
      console.error(
        "Detailed error:",
        JSON.stringify(emailError.response?.body || emailError, null, 2)
      );

      // Return a 500 status for email errors to clearly indicate the issue
      return res.status(500).json({
        message:
          "Application was saved but there was an issue sending confirmation emails. Please contact support.",
        error: emailError.message,
        studentRef: studentRef.id,
        parentRef: parentRef.id,
      });
    }
  } catch (error) {
    console.error("❌ Application error:", error);
    if (error.code === "auth/invalid-credential") {
      return res
        .status(500)
        .json({
          message:
            "Firebase authentication failed. Please check your configuration.",
        });
    }
    return res.status(500).json({
      message: "Failed to process application.",
      error: error.message,
    });
  }
});

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure default email settings
const DEFAULT_FROM = {
  email: process.env.SENDGRID_FROM_EMAIL || "greenvalleyproject01@gmail.com",
  name: "Green Valley School Admissions",
};

// Student Login endpoint
app.post("/api/auth/student/login", async (req, res) => {
  const { studentId, password } = req.body;

  try {
    // Find student by ID
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef
      .where("studentId", "==", studentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(401)
        .json({ message: "Invalid student ID or password" });
    }

    const studentDoc = snapshot.docs[0];
    const student = studentDoc.data();

    // Check if account is active and application is approved
    if (!student.isActive || student.applicationStatus !== "approved") {
      return res.status(401).json({
        message: "Account is not activated or application is pending approval",
      });
    }

    // Verify password
    const hashedPassword = crypto
      .pbkdf2Sync(password, student.salt, 1000, 64, "sha512")
      .toString("hex");
    if (hashedPassword !== student.password) {
      return res
        .status(401)
        .json({ message: "Invalid student ID or password" });
    }

    // Log login attempt
    await studentDoc.ref.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        studentId: student.studentId,
        name: student.studentName,
        grade: student.grade,
        type: "student",
      },
    });
  } catch (error) {
    console.error("Student login error:", error);
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
});

// Parent Login endpoint
app.post("/api/auth/parent/login", async (req, res) => {
  const { parentId, password } = req.body;

  try {
    // Find parent by ID
    const parentsRef = db.collection("parents");
    const snapshot = await parentsRef
      .where("parentId", "==", parentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Invalid parent ID or password" });
    }

    const parentDoc = snapshot.docs[0];
    const parent = parentDoc.data();

    // Check if account is active and application is approved
    if (!parent.isActive || parent.applicationStatus !== "approved") {
      return res.status(401).json({
        message: "Account is not activated or application is pending approval",
      });
    }

    // Verify password
    const hashedPassword = crypto
      .pbkdf2Sync(password, parent.salt, 1000, 64, "sha512")
      .toString("hex");
    if (hashedPassword !== parent.password) {
      return res.status(401).json({ message: "Invalid parent ID or password" });
    }

    // Get children information
    const studentsRef = db.collection("students");
    const childrenSnapshot = await studentsRef
      .where("parentId", "==", parentId)
      .get();
    const children = childrenSnapshot.docs.map((doc) => ({
      name: doc.data().studentName,
      grade: doc.data().grade,
    }));

    // Log login attempt
    await parentDoc.ref.update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        parentId: parent.parentId,
        name: parent.name,
        type: "parent",
        children,
      },
    });
  } catch (error) {
    console.error("Parent login error:", error);
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
});

// Admin endpoint to approve applications
app.post("/api/admin/approve-application", async (req, res) => {
  const { studentId, approved, adminKey } = req.body;

  // Verify admin key (you should use proper admin authentication in production)
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin key" });
  }

  try {
    // Find student application
    const studentsRef = db.collection("students");
    const studentSnapshot = await studentsRef
      .where("studentId", "==", studentId)
      .limit(1)
      .get();

    if (studentSnapshot.empty) {
      return res.status(404).json({ message: "Application not found" });
    }

    const studentDoc = studentSnapshot.docs[0];
    const studentData = studentDoc.data();
    const parentId = studentData.parentId;

    // Find parent document
    const parentsRef = db.collection("parents");
    const parentSnapshot = await parentsRef
      .where("parentId", "==", parentId)
      .limit(1)
      .get();

    if (parentSnapshot.empty) {
      return res.status(404).json({ message: "Parent record not found" });
    }

    const parentDoc = parentSnapshot.docs[0];
    const parentData = parentDoc.data();

    if (approved) {
      // Update application status and send credentials
      const updates = {
        applicationStatus: "approved",
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        credentialsSent: true,
      };

      // Update both student and parent records
      await studentDoc.ref.update(updates);
      await parentDoc.ref.update(updates);

      // Send approval emails with credentials
      const parentMsg = {
        to: parentData.email,
        from: DEFAULT_FROM,
        subject: "Green Valley School Application Approved - Portal Access",
        html: `
          <h1>Congratulations!</h1>
          <p>Dear ${parentData.name},</p>
          <p>We are pleased to inform you that your application to Green Valley School has been approved!</p>
          <h2>Parent Portal Access</h2>
          <p>You can now access the Parent Portal with the following credentials:</p>
          <ul>
            <li><strong>Parent ID:</strong> ${parentId}</li>
            <li><strong>Activation Code:</strong> ${parentData.activationCode}</li>
          </ul>
          <p>To activate your account:</p>
          <ol>
            <li>Visit the Parent Portal</li>
            <li>Click on "First time access? Activate your account"</li>
            <li>Enter your Parent ID and Activation Code</li>
            <li>Create your password</li>
          </ol>
          <p>For security reasons, please activate your account within 48 hours.</p>
        `,
      };

      const studentMsg = {
        to: studentData.studentEmail,
        from: DEFAULT_FROM,
        subject: "Welcome to Green Valley School - Student Portal Access",
        html: `
          <h1>Welcome to Green Valley School!</h1>
          <p>Dear ${studentData.studentName},</p>
          <p>Your application has been approved! You can now access your Student Portal account.</p>
          <h2>Student Portal Access</h2>
          <p>Here are your portal access credentials:</p>
          <ul>
            <li><strong>Student ID:</strong> ${studentId}</li>
            <li><strong>Activation Code:</strong> ${studentData.activationCode}</li>
          </ul>
          <p>To activate your account:</p>
          <ol>
            <li>Visit the Student Portal</li>
            <li>Click on "First time access? Activate your account"</li>
            <li>Enter your Student ID and Activation Code</li>
            <li>Create your password</li>
          </ol>
          <p>For security reasons, please activate your account within 48 hours.</p>
        `,
      };

      // Send emails
      await Promise.all([sgMail.send(parentMsg), sgMail.send(studentMsg)]);

      return res.status(200).json({
        message: "Application approved and credentials sent successfully",
        studentId,
        parentId,
      });
    } else {
      // If not approved, update status to rejected
      const updates = {
        applicationStatus: "rejected",
        rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await studentDoc.ref.update(updates);
      await parentDoc.ref.update(updates);

      // Send rejection emails
      const rejectionMsg = {
        to: parentData.email,
        from: DEFAULT_FROM,
        subject: "Green Valley School Application Status Update",
        html: `
          <p>Dear ${parentData.name},</p>
          <p>Thank you for your interest in Green Valley School.</p>
          <p>After careful review of your application, we regret to inform you that we are unable to offer admission at this time.</p>
          <p>We wish you success in your future educational endeavors.</p>
          <br/>
          <p>Best regards,<br/>Green Valley School Admissions Team</p>
        `,
      };

      await sgMail.send(rejectionMsg);

      return res.status(200).json({
        message: "Application rejected and notification sent",
        studentId,
        parentId,
      });
    }
  } catch (error) {
    console.error("Application approval error:", error);
    return res.status(500).json({
      message: "Failed to process application approval",
      error: error.message,
    });
  }
});

// Admin endpoint to list pending applications
app.get("/api/admin/pending-applications", async (req, res) => {
  const { adminKey } = req.query;

  // Verify admin key
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin key" });
  }

  try {
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef
      .where("applicationStatus", "==", "pending")
      .orderBy("createdAt", "desc")
      .get();

    const applications = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      applications.push({
        studentId: data.studentId,
        studentName: data.studentName,
        grade: data.grade,
        submittedAt: data.createdAt.toDate(),
        parentName: data.parentName,
        parentEmail: data.parentEmail,
      });
    }

    return res.status(200).json({
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    return res.status(500).json({
      message: "Failed to fetch pending applications",
      error: error.message,
    });
  }
});

// Activation endpoint for both student and parent accounts
app.post("/api/auth/activate", async (req, res) => {
  const { userType, userId, activationCode, password } = req.body;

  try {
    // Determine collection based on user type
    const collection = userType === "student" ? "students" : "parents";
    const idField = userType === "student" ? "studentId" : "parentId";

    const ref = db.collection(collection);
    const snapshot = await ref.where(idField, "==", userId).limit(1).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = snapshot.docs[0];
    const userData = doc.data();

    // Verify activation code
    if (userData.activationCode !== activationCode) {
      return res.status(400).json({ message: "Invalid activation code" });
    }

    // Check if already activated
    if (userData.isActive) {
      return res.status(400).json({ message: "Account is already activated" });
    }

    // Generate salt and hash password
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    // Update user document
    await doc.ref.update({
      isActive: true,
      salt,
      password: hashedPassword,
      activatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: "Account activated successfully",
      userType,
      userId,
    });
  } catch (error) {
    console.error("Activation error:", error);
    return res
      .status(500)
      .json({ message: "Activation failed", error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ✅ Your routes come **after** app is defined
app.post("/api/apply", async (req, res) => {
  console.log("📥 Received request to /api/apply");

  const formData = req.body;
  if (!formData) {
    return res.status(400).json({ message: "No form data received" });
  }

  // Generate unique IDs and codes
  const studentId = "S" + crypto.randomBytes(3).toString("hex").toUpperCase();
  const studentActivationCode = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();
  const parentId = "P" + crypto.randomBytes(3).toString("hex").toUpperCase();
  const parentActivationCode = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();

  console.log("📥 Received application:", formData);
  console.log("👨‍🎓 Generated student ID:", studentId);
  console.log("🔑 Generated student activation code:", studentActivationCode);
  console.log("👤 Generated parent ID:", parentId);
  console.log("🔑 Generated parent activation code:", parentActivationCode);

  // Validate required fields
  const requiredFields = ["studentName", "studentEmail", "parentName", "email"];
  for (const field of requiredFields) {
    if (!formData[field]) {
      return res.status(400).json({
        message: `Missing required field: ${field}`,
      });
    }
  }

  try {
    // Create parent document in Firestore
    const parentRef = await db.collection("parents").add({
      parentId: parentId,
      name: formData.parentName,
      email: formData.email,
      phone: formData.phone,
      activationCode: parentActivationCode,
      isActive: false,
      applicationStatus: "pending",
      credentialsSent: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Store student data in Firestore
    const studentRef = await db.collection("students").add({
      studentId: studentId,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      activationCode: studentActivationCode,
      isActive: false,
      applicationStatus: "pending",
      credentialsSent: false,
      // Academic information
      grade: formData.grade,
      previousSchool: formData.previousSchool,
      previousGrades: formData.previousGrades,
      // Personal information
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      extracurriculars: formData.extracurriculars,
      // Emergency information
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      medicalConditions: formData.medicalConditions,
      // Application specific
      whyGreenValley: formData.whyGreenValley,
      additionalInfo: formData.additionalInfo,
      // Parent reference
      parentId: parentId,
      parentRef: parentRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("💾 Stored in Firestore with ID:", docRef.id);

    // Log email addresses for verification
    console.log("📧 Sending emails to:", {
      parentEmail: formData.email,
      studentEmail: formData.studentEmail,
    });

    // Prepare email messages
    const parentMsg = {
      to: formData.email,
      from: DEFAULT_FROM,
      subject: "Green Valley School Application Received",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
      html: `
        <p>Dear ${formData.parentName},</p>
        <p>Thank you for applying to Green Valley School on behalf of ${formData.studentName}.</p>
        <p>We have received your application for Grade ${formData.grade} and our admissions team will review it shortly.</p>
        <h3>Next Steps</h3>
        <ol>
          <li>Our admissions team will review your application</li>
          <li>You will receive an email with the application decision</li>
          <li>If accepted, you will receive separate login credentials for both parent and student portals</li>
        </ol>
        <p>We appreciate your interest in Green Valley School and will contact you soon.</p>
        <br />
        <p>Best regards,<br/>Green Valley School Admissions Team</p>
      `,
    };

    const studentMsg = {
      to: formData.studentEmail,
      from: DEFAULT_FROM,
      subject: "Application Received - Green Valley School",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
      html: `
        <h1>Hi ${formData.studentName},</h1>
        <p>Thank you for applying to Green Valley School. We’ve received your application and will get back to you shortly.</p>
      `,
    };

    try {
      // Send emails one at a time to better track which one fails
      console.log("📧 Attempting to send parent email...");
      const parentResult = await sgMail.send(parentMsg);
      console.log("✅ Parent email sent successfully");

      console.log("📧 Attempting to send student email...");
      const studentResult = await sgMail.send(studentMsg);
      console.log("✅ Student email sent successfully");

      console.log("✉️ All emails sent successfully:", {
        parentEmail: parentResult,
        studentEmail: studentResult,
      });

      return res.status(200).json({
        message: "Application submitted and emails sent successfully.",
        studentId: docRef.id,
        activationCode,
      });
    } catch (emailError) {
      console.error("📧 Email sending error:", emailError);
      console.error(
        "Detailed error:",
        JSON.stringify(emailError.response?.body || emailError, null, 2)
      );

      // Return a 500 status for email errors to clearly indicate the issue
      return res.status(500).json({
        message:
          "Application was saved but there was an issue sending confirmation emails. Please contact support.",
        error: emailError.message,
        studentId: docRef.id,
        activationCode,
      });
    }
  } catch (error) {
    console.error("❌ Application error:", error);
    if (error.code === "auth/invalid-credential") {
      return res
        .status(500)
        .json({
          message:
            "Firebase authentication failed. Please check your configuration.",
        });
    }
    return res.status(500).json({
      message: "Failed to process application.",
      error: error.message,
    });
  }
});

app.post("/api/activate", async (req, res) => {
  const { email, activationCode, password } = req.body;

  try {
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef
      .where("studentEmail", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentDoc = snapshot.docs[0];
    const studentData = studentDoc.data();

    if (studentData.activationCode !== activationCode) {
      return res.status(400).json({ message: "Invalid activation code" });
    }

    if (studentData.isActive) {
      return res.status(400).json({ message: "Account is already activated" });
    }

    // Hash the password before storing
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    await studentDoc.ref.update({
      password: hashedPassword,
      salt: salt,
      isActive: true,
      activationCode: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Account activated successfully" });
  } catch (error) {
    console.error("❌ Activation error:", error);
    return res.status(500).json({ message: "Failed to activate account" });
  }
});

app.get("/api/checkActivation/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef
      .where("studentId", "==", studentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentDoc = snapshot.docs[0];
    return res.status(200).json({
      isActive: studentDoc.data().isActive || false,
    });
  } catch (error) {
    console.error("❌ Activation check error:", error);
    return res
      .status(500)
      .json({ message: "Failed to check activation status" });
  }
});

// Test endpoint for Firebase connection
app.get("/api/test-firebase", async (req, res) => {
  try {
    // Try to access Firestore
    const testDoc = await db.collection("test").add({
      message: "Test connection",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("test").doc(testDoc.id).delete();

    res.json({
      success: true,
      message: "Firebase connection successful!",
    });
  } catch (error) {
    console.error("Firebase test error:", error);
    res.status(500).json({
      success: false,
      message: "Firebase connection failed",
      error: error.message,
    });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
