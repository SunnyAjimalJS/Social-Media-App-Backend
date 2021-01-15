const functions = require("firebase-functions");
const app = require("express")();

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login } = require("./handlers/users");

const firebase = require("firebase");
firebase.initializeApp(config);

// Screams Routes:
app.get("/screams", getAllScreams); //GET data/screams from firebase collection.
app.post("/scream", FBAuth, postOneScream); //POST a scream/data to firebase collection with FBAuth middleware to check for an auth header.

// Users Routes: 
app.post("/signup", signup); //Signup Route.
app.post("/login", login); //Login Route.

// Helper function to validate emails client side:
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

// Helper function to check if a field is empty client side:
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

exports.api = functions.region("europe-west1").https.onRequest(app);
