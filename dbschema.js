const { user } = require("firebase-functions/lib/providers/auth");

let db = {
  users: [
    {
      userId: "cOpC6RJLfialVbGEd22x6XUiYVw1",
      email: "user@email.com",
      handle: "user",
      createdAt: "2021-01-18T16:22:13.325Z",
      imageUrl: "image/random/random",
      bio: "Hello, my name is user, nice to meet you",
      website: "https://user.com",
      location: "London, UK",
    },
  ],
  screams: [
    {
      userHandle: "user",
      body: "this will be the scream body",
      createdAt: "2021-01-11T13:17:06.650Z",
      likeCount: 5,
      commentCount: 2,
    },
  ],
};

const userDetails = {
  // Redux Data
  credentials: {
    userId: "cOpC6RJLfialVbGEd22x6XUiYVw1",
    email: "user@email.com",
    handle: "user",
    createdAt: "2021-01-18T16:22:13.325Z",
    imageUrl: "image/random/random",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "London, UK",
  },
  likes: [
    { userHandle: "user", screamId: "EpcLRIYTmkpM0BMdAtKz" },
    { userHandle: "user", screamId: "9iDAWdywkICq8K9mtHlB" },
  ],
};
