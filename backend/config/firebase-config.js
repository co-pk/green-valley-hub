const admin = require("firebase-admin");

// Initialize Firebase Admin with your service account
const serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const settings = {
  ignoreUndefinedProperties: true,
};
db.settings(settings);

module.exports = { admin, db };
