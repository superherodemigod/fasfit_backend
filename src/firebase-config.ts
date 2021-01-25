var admin = require("firebase-admin");

var serviceAccount = require("./fasfit-e8f80-firebase-adminsdk-jqjq0-15de5e51a0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fasfit-e8f80-default-rtdb.firebaseio.com/"
})

export default admin;
