const { admin, db } = require('./config/firebase-config');
const crypto = require('crypto');

// Define admin email - this should be fixed and consistent
const ADMIN_EMAIL = 'admin@greenvalleyacademy.edu';

/**
 * Idempotent function to create or update the admin user
 * - If admin exists: updates password
 * - If admin doesn't exist: creates new admin with custom claim
 */
const setupAdmin = async () => {
    try {
        // Generate a secure random password
        const password = crypto.randomBytes(12).toString('hex');
        let userRecord;
        let isNewUser = false;

        // First check if admin user already exists
        try {
            userRecord = await admin.auth().getUserByEmail(ADMIN_EMAIL);
            console.log('\x1b[33m%s\x1b[0m', 'Admin account already exists');
            
            // Update password for existing admin
            await admin.auth().updateUser(userRecord.uid, { password });
            console.log('\x1b[32m%s\x1b[0m', 'Admin password has been reset successfully!');
        } catch (error) {
            // If user doesn't exist, create a new one
            if (error.code === 'auth/user-not-found') {
                // Create new admin user
                userRecord = await admin.auth().createUser({
                    email: ADMIN_EMAIL,
                    password,
                    emailVerified: true
                });
                
                // Set custom claim for admin privileges
                await admin.auth().setCustomUserClaims(userRecord.uid, { isAdmin: true });
                isNewUser = true;
                
                console.log('\x1b[32m%s\x1b[0m', 'Admin account created successfully!');
            } else {
                throw error; // Re-throw if it's a different error
            }
        }

        // Ensure Firestore document exists/is updated
        await db.collection('admins').doc(userRecord.uid).set({
            email: ADMIN_EMAIL,
            name: 'System Admin',
            isActive: true,
            isAdmin: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...(isNewUser && { createdAt: admin.firestore.FieldValue.serverTimestamp() })
        }, { merge: true });

        // Display credentials
        console.log('\x1b[36m%s\x1b[0m', 'Admin Credentials (SAVE THESE):');
        console.log('Email:', ADMIN_EMAIL);
        console.log('Password:', password);
        console.log('\nYou can use these credentials to log in to the admin portal at /admin');
        
        return { success: true };
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error setting up admin account:', error);
        process.exit(1); // Exit with error code
    }
};

// Execute the setup function
setupAdmin();
