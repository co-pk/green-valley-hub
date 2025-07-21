const { db, admin } = require('../config/firebase-config');
const sgMail = require('@sendgrid/mail');
const logger = require('./logger');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendApplicationEmails = async (studentData, parentData, isApproved) => {
    try {
        // Prepare student email
        const studentEmail = {
            to: studentData.studentEmail,
            from: process.env.SENDGRID_FROM_EMAIL,
            templateId: isApproved ? 
                process.env.SENDGRID_APPROVAL_TEMPLATE : 
                process.env.SENDGRID_REJECTION_TEMPLATE,
            subject: isApproved ? 
                "Congratulations — Your Application is Approved!" : 
                "Update on Your Application",
            dynamicTemplateData: {
                recipientName: studentData.studentName,
                studentId: studentData.studentId,
                activationCode: isApproved ? studentData.activationCode : null,
                isStudent: true
            }
        };

        // Prepare parent email
        const parentEmail = {
            to: parentData.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            templateId: isApproved ? 
                process.env.SENDGRID_APPROVAL_TEMPLATE : 
                process.env.SENDGRID_REJECTION_TEMPLATE,
            subject: isApproved ? 
                "Congratulations — Your Child's Application is Approved!" : 
                "Update on Your Child's Application",
            dynamicTemplateData: {
                recipientName: parentData.name,
                studentName: studentData.studentName,
                parentId: parentData.parentId,
                activationCode: isApproved ? parentData.activationCode : null,
                isParent: true
            }
        };

        // Send both emails
        const [studentResult, parentResult] = await Promise.all([
            sgMail.send(studentEmail),
            sgMail.send(parentEmail)
        ]);

        logger.info('Emails sent successfully', {
            studentEmail: studentData.studentEmail,
            parentEmail: parentData.email,
            isApproved
        });

        return { success: true, studentResult, parentResult };
    } catch (error) {
        logger.error('Error sending emails', {
            error: error.message,
            studentId: studentData.studentId
        });
        throw error;
    }
};

const updateApplicationStatus = async (studentDoc, parentRef, isApproved) => {
    try {
        const batch = db.batch();
        
        // Update student document
        batch.update(studentDoc.ref, {
            applicationStatus: isApproved ? 'approved' : 'rejected',
            isActive: isApproved,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...(isApproved ? {} : { activationCode: null })
        });

        // Update parent document
        batch.update(db.collection('parents').doc(parentRef), {
            applicationStatus: isApproved ? 'approved' : 'rejected',
            isActive: isApproved,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...(isApproved ? {} : { activationCode: null })
        });

        await batch.commit();

        logger.info('Application status updated', {
            studentId: studentDoc.id,
            status: isApproved ? 'approved' : 'rejected'
        });

        return true;
    } catch (error) {
        logger.error('Error updating application status', {
            error: error.message,
            studentId: studentDoc.id
        });
        throw error;
    }
};

module.exports = {
    sendApplicationEmails,
    updateApplicationStatus
};
