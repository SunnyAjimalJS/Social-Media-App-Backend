const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth"); // Firebase Auth middleware to check for an auth token

const { db } = require("./util/admin");

const {
  getAllScreams,
  postOneScream,
  getScream,
  deleteScream,
  commentOnScream,
  likeScream,
  unlikeScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

// Scream Routes for Firebase (screams are posts by users):
app.get("/screams", getAllScreams); // GET data/all screams
app.post("/scream", FBAuth, postOneScream); // POST route to create a scream
app.get("/scream/:screamId", getScream); // GET route to get data from one scream
app.delete("/scream/:screamId", FBAuth, deleteScream); // DELETE route to delete a scream
app.post("/scream/:screamId/comment", FBAuth, commentOnScream); // POST route to create a comment on a scream
app.get("/scream/:screamId/like", FBAuth, likeScream); // GET route to like a scream
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream); // GET route to unline a scream

// User Routes for Firebase:
app.post("/signup", signup); // POST route to provide login data and Signup
app.post("/login", login); // POST route to login using user credentials and obtain an Auth Token for FBAuth (Firebase Auth) middleware
app.post("/user/image", FBAuth, uploadImage); // POST route to upload a user image
app.post("/user", FBAuth, addUserDetails); // POST route to add user profile details
app.get("/user", FBAuth, getAuthenticatedUser); // GET route to get and access user data once logged in

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            receipient: doc.data().userhandle,
            sender: snapshot.data().userhandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}");

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .then((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            receipient: doc.data().userhandle,
            sender: snapshot.data().userhandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
