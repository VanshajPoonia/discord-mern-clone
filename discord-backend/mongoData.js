import mongoose from "mongoose";

// import { createRequire } from "module";
// const mongoose = require("mongoose");

// we will define our schema ...
// channels// messages.....

const discordSchema = mongoose.Schema({
  channelName: String,
  conversation: [
    {
      message: String,
      timestamp: String,
      user: {
        displayName: String,
        email: String,
        photo: String,
        uid: String,
      },
    },
  ],
});

// collection name : conversations...

//github export
// module.exports = mongoose.model("conversations", discordSchema);

//my export
export default mongoose.model("conversations", discordSchema);

// import mongoose from "mongoose";
// const discordSchema = mongoose.Schema({
//   channelName: String,
//   conversation: [
//     {
//       message: String,
//       timestamp: String,
//       user: {
//         displayName: String,
//         email: String,
//         photo: String,
//         uid: String,
//       },
//     },
//   ],
// });

// export default mongoose.model("conversations", discordSchema);
