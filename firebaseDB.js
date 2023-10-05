// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");

// // Initialize the Firebase Admin SDK with your service account credentials
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Get a reference to the Firestore database
// const db = admin.firestore();

// // Database is connected or not
// db.collection("users")
//   .get()
//   .then((success) => {
//     console.log("DB is connected!");
//     console.log(
//       `Retrieved size is ${success.size} documents from the "users" collection.`
//     );
//   })
//   .catch((error) => {
//     console.error("Error:-", error);
//   });

// module.exports = db;
