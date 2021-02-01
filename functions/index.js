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
  getUserDetails,
  markNotificationsRead,
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
app.get("/user/:handle", getUserDetails); // GET route to get a specific user's details by their handle
app.post("/notifications", FBAuth, markNotificationsRead); // POST route to mark notifications as read by users

// API function:
exports.api = functions.region("europe-west1").https.onRequest(app);

// Cloud Firestore Trigger functions for Notifications:
// Create a user notification when a scream is liked:
exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// Delete a user notification when a user unlikes a scream
exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// Create a user notification when a comment is made on a scream
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

// Trigger to automatically update the userImage whenever they update their own photo for display in their screams:
exports.onUserImageChange = functions
  .region("europe-west1")
  .document("/users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      let batch = db.batch();
      return db
        .document("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    }
  });
