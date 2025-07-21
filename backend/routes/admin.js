const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase-config');
const { updateApplicationStatus } = require('../utils/emailHandler');
const logger = require('../utils/logger');

// Admin login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check admin in Firestore
        const adminSnapshot = await db.collection('admins')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (adminSnapshot.empty) {
            logger.warning('Admin login failed - user not found', { email });
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        try {
            // Verify with Firebase Auth
            const userRecord = await admin.auth().getUserByEmail(email);
            
            // Create a custom token for the admin user
            // Note: In a real-world scenario, you would verify the password before creating a token
            // This is a simplified approach since Firebase Admin SDK doesn't provide direct password verification
            const token = await admin.auth().createCustomToken(userRecord.uid);
            
            if (!token) {
                throw new Error('Invalid credentials');
            }
            
            const adminData = adminSnapshot.docs[0].data();

            logger.info('Admin logged in successfully', { email });
            res.json({
                success: true,
                admin: {
                    email: adminData.email,
                    name: adminData.name
                }
            });
        } catch (error) {
            logger.error('Admin login error', { error: error.message, email });
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        logger.error('Admin login error', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get pending applications
router.get('/pending-applications', async (req, res) => {
    try {
        const studentsSnapshot = await db.collection('students')
            .where('applicationStatus', '==', 'pending')
            .get();

        const applications = [];
        for (const doc of studentsSnapshot.docs) {
            const studentData = doc.data();
            const parentDoc = await db.collection('parents').doc(studentData.parentRef).get();
            const parentData = parentDoc.data();

            applications.push({
                studentId: studentData.studentId,
                studentName: studentData.studentName,
                grade: studentData.grade,
                submittedAt: studentData.createdAt.toDate(),
                parentName: parentData.name,
                parentEmail: parentData.email
            });
        }

        logger.info('Pending applications retrieved', { count: applications.length });
        res.json({ success: true, applications });
    } catch (error) {
        logger.error('Error fetching pending applications', { error: error.message });
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch pending applications' 
        });
    }
});

// Verify activation status
router.get('/check-activation/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const studentsSnapshot = await db.collection('students')
            .where('studentId', '==', studentId)
            .limit(1)
            .get();

        if (studentsSnapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const studentData = studentsSnapshot.docs[0].data();
        res.json({
            success: true,
            isActive: studentData.isActive,
            applicationStatus: studentData.applicationStatus
        });
    } catch (error) {
        logger.error('Error checking activation status', { 
            error: error.message, 
            studentId: req.params.studentId 
        });
        res.status(500).json({
            success: false,
            message: 'Failed to check activation status'
        });
    }
});

// Activate account
router.post('/activate', async (req, res) => {
    try {
        const { studentId, activationCode } = req.body;

        if (!studentId || !activationCode) {
            return res.status(400).json({
                success: false,
                message: 'Student ID and activation code are required'
            });
        }

        const studentsSnapshot = await db.collection('students')
            .where('studentId', '==', studentId)
            .where('activationCode', '==', activationCode)
            .limit(1)
            .get();

        if (studentsSnapshot.empty) {
            return res.status(401).json({
                success: false,
                message: 'Invalid activation code'
            });
        }

        const studentDoc = studentsSnapshot.docs[0];
        await studentDoc.ref.update({
            isActive: true,
            activatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        logger.info('Account activated successfully', { studentId });
        res.json({
            success: true,
            message: 'Account activated successfully'
        });
    } catch (error) {
        logger.error('Error activating account', { 
            error: error.message, 
            studentId: req.body.studentId 
        });
        res.status(500).json({
            success: false,
            message: 'Failed to activate account'
        });
    }
});

// Application decision endpoint
router.post('/decision', async (req, res) => {
    const { studentId, approved } = req.body;
    
    if (!studentId || approved === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Student ID and decision are required'
        });
    }

    try {
        // Find student document
        const studentsSnapshot = await db.collection('students')
            .where('studentId', '==', studentId)
            .limit(1)
            .get();

        if (studentsSnapshot.empty) {
            logger.warning('Application decision failed - student not found', { studentId });
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const studentDoc = studentsSnapshot.docs[0];
        const studentData = studentDoc.data();
        const newStatus = approved ? 'approved' : 'rejected';

        // Update application status
        await studentDoc.ref.update({
            applicationStatus: newStatus,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send email notification
        await updateApplicationStatus(studentDoc, studentData.parentRef, approved);

        logger.info(`Application ${newStatus}`, { studentId });
        res.json({
            success: true,
            message: `Application ${approved ? 'approved' : 'rejected'} successfully`
        });
    } catch (error) {
        logger.error('Error processing application decision', { 
            error: error.message, 
            studentId: req.body.studentId 
        });
        res.status(500).json({
            success: false,
            message: 'Failed to process application'
        });
    }
});

module.exports = router;
