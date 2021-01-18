const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login } = require("./handlers/users");

// Screams Routes:
app.get("/screams", getAllScreams); //GET data/all screams from firebase collection.
app.post("/scream", FBAuth, postOneScream); //POST a scream/data to firebase collection with FBAuth middleware to check for an auth header.

// Users Routes:
app.post("/signup", signup); //Signup Route.
app.post("/login", login); //Login Route.

exports.api = functions.region("europe-west1").https.onRequest(app);
