import admin from 'firebase-admin';

// firebase admin stuff
let serviceAccount = require('../../town-fd22d-firebase-adminsdk-4wvg4-f91896103a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();
export const auth = admin.auth();
