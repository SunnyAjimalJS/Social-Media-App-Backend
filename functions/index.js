const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
} = require("./handlers/users");

// Scream Routes:
app.get("/screams", getAllScreams); // GET data/all screams from firebase collection
app.post("/scream", FBAuth, postOneScream); // POST a scream/data to firebase collection with FBAuth middleware to check for an auth header
app.post("/user/image", FBAuth, uploadImage); // POST route to upload a user image
app.post("/user", FBAuth, addUserDetails); // POST route to add user profile details
app.get("/user", FBAuth, getAuthenticatedUser); // GET route to get and access user data once logged in

// User Routes:
app.post("/signup", signup); // Signup Route
app.post("/login", login); // Login Route

exports.api = functions.region("europe-west1").https.onRequest(app);
