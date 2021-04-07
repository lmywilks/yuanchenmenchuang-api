const admin = require('firebase-admin');
const { SERVICE_ACCOUNT } = require('./config');

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    projectId: "yuanchenmenchuang",
    databaseURL: "https://yuanchenmenchuang.firebaseio.com",
    storageBucket: "yuanchenmenchuang.appspot.com"
});
const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };