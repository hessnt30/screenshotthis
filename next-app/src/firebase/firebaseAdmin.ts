// src/firebase/firebaseAdmin.ts
import admin from "firebase-admin";
import { serviceAccount } from "./screenshotthis-bb478-firebase-adminsdk-fbsvc-71362b1689";
// import { serviceAccount } from "./screenshotthis-bb478-firebase-adminsdk-fbsvc-86036c6225";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
