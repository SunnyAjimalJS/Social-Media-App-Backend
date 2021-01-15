const functions = require("firebase-functions");
const app = require("express")();

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup } = require("./handlers/users");

const firebase = require("firebase");
firebase.initializeApp(config);

// Scream Routes:
app.get("/screams", getAllScreams); //// GET data/screams from firebase collection:
app.post("/scream", FBAuth, postOneScream); //POST a scream/data to firebase collection with FBAuth middleware to check for an auth header.

// FBAuth (Firebase Auth check) middleware function:
const FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No Token Found");
    return response.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("/users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return response.status(403).json(err);
    });
};

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

// Signup Route:
app.post("/signup", signup);

// Login Route
app.post("/login", login);

exports.api = functions.region("europe-west1").https.onRequest(app);
