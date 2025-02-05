// // src/firebase/firebaseAdmin.ts
// import admin from "firebase-admin";
// import { serviceAccount } from "./blockops-81ebe-firebase-adminsdk-fbsvc-ead445a04b";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
//   });
// }

// export const adminDb = admin.firestore();
// export const adminAuth = admin.auth();
