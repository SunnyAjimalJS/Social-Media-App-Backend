const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const config = {
  apiKey: "AIzaSyClJdQl77TVrlDAvXjCfBOuvZqiFOBS_GI",
  authDomain: "socialape-62ab3.firebaseapp.com",
  databaseURL:
    "https://socialape-62ab3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "socialape-62ab3",
  storageBucket: "socialape-62ab3.appspot.com",
  messagingSenderId: "167455888246",
  appId: "1:167455888246:web:6457cc706eb8d9eac16057",
  measurementId: "G-P76FMHSQER",
};

const express = require("express");
const app = express();

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
