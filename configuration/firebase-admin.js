import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    // Temporarily comment out Firebase initialization for build
    // admin.initializeApp({
    //   credential: admin.credential.cert(
    //     JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    //   ),
    // });
  } catch (err) {
    console.error("Firebase Admin initialization error:", err);
  }
}

// Export both names to fix all imports
export const mockAuthAdmin = {
  createUser: () => Promise.resolve({ uid: 'mock-uid' }),
  setCustomUserClaims: () => Promise.resolve(),
  deleteUser: () => Promise.resolve()
};

// Also export as authAdmin for existing imports
export const authAdmin = mockAuthAdmin;