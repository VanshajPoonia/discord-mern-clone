import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mongoData from "./mongoData.js";
import Pusher from "pusher";

// import { createRequire } from "module";
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const mongoData = require("./mongoData");
// const Pusher = require("pusher");
// **** app config

const app = express();
const port = process.env.PORT || 4000;

////////////////////************************************/////////////////////
// *** PUSHER API KEYS COMMENTED...-> to be encrypted...

// const pusher = new Pusher({
// appId: "1101676",
// key: "9ce3e934f0eeb3e92ff8",
// secret: "7e1b21dbe0a78fa8ef0f",
// cluster: "ap2",
// useTLS: true,
// });
const pusher = new Pusher({
  appId: "1210351",
  key: "8082b6127f3336f56b3c",
  secret: "2a75613e64db73863d1d",
  cluster: "ap2",
  useTLS: true,
});

//////////////////////***********************************////////////////////

// middleware - mediates between frontend & backend...
// we would be able to handle json files & send/receive projects...

// **** middleware

app.use(express.json());

// / adding header...
// app.use((req,res , next) => {

// / allowing request to come from any endpoint
// res.setHeader("Access-Control-Allow-Origin","*");
// res.setHeader("Access-Control-Allow-Headers","*");
// next() ;
// })
// [**OR USE THE CORS PACKAGE**]

app.use(cors());

//  **** DB config

// mongodb+srv://admin:<password>@cluster0.qa9j4.mongodb.net/<dbname>?retryWrites=true&w=majority

//////////////////////***********************************////////////////////
// ***MONGODB CONNECTION URL KEY COMMENTED... -> to be encrypted...
const connection_url =
  "mongodb+srv://admin:aN2H98g9CvTTWKOj@cluster0.155wf.mongodb.net/discordDB?retryWrites=true&w=majority";
//"mongodb+srv://admin:9G5z29mSBzwF1GDr@cluster0.sczjl.mongodb.net/discordclonedb?retryWrites=true&w=majority";

//////////////////////***********************************////////////////////

mongoose.connect(connection_url, {
  // to connect smoothly to my mongodb

  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// once the connection is open -> we fire off the function
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("conversations");
  const changeStream = msgCollection.watch();
  // we fire off a function once there is a change in DB

  changeStream.on("change", (change) => {
    console.log("change occured", change);

    if (change.operationType === "insert") {
      pusher.trigger("channels", "newChannel", {
        change: change,
      });
    } else if (change.operationType === "update") {
      pusher.trigger("conversation", "newMessage", {
        change: change,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});

// **** api routes

// https code 200 -> OK
app.get("/", (req, res) => res.status(200).send("working"));

app.post("/new/channel", (req, res) => {
  const dbData = req.body;

  mongoData.create(dbData, (err, data) => {
    if (err) {
      // if error then we send internal server error
      res.status(500).send(err);
    } else {
      // send data that we just added in the DB
      res.status(201).send(data);
    }
  });
});

app.get("/get/channelList", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      // if error then we send internal server error
      res.status(500).send(err);
    } else {
      let channels = [];
      data.map((channelData) => {
        const channelInfo = {
          id: channelData._id,
          name: channelData.channelName,
        };
        channels.push(channelInfo);
      });

      // send data that we just added in the DB
      res.status(200).send(channels);
    }
  });
});

//  for putting new message
app.post("/new/message", (req, res) => {
  const newMessage = req.body;
  //    to inject a new message
  mongoData.update(
    { _id: req.query.id },
    { $push: { conversation: req.body } },
    (err, data) => {
      if (err) {
        // if error then we send internal server error
        res.status(500).send(err);
        console.log(err);
      } else {
        // send data that we just added in the DB
        res.status(201).send(data);
      }
    }
  );
});

app.get("/get/data", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      // if error then we send internal server error
      res.status(500).send(err);
    } else {
      // send data that we just added in the DB
      res.status(200).send(channels);
    }
  });
});

//  for retrieving info...

app.get("/get/conversation", (req, res) => {
  const id = req.query.id;
  mongoData.find({ _id: id }, (err, data) => {
    if (err) {
      // if error then we send internal server error
      res.status(500).send(err);
    } else {
      // send data that we just added in the DB
      res.status(200).send(channels);
    }
  });
});

// **** listener

app.listen(port, () => console.log(`server running on port: ${port}`));

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import mongoData from "./mongoData.js";

// //  app config
// const app = express();
// const port = process.env.PORT || 8002;

// //  middlewares
// app.use(express.json());
// app.use(cors());

// //  db config

// const mongoURI =
//   "mongodb+srv://admin:aN2H98g9CvTTWKOj@cluster0.155wf.mongodb.net/discordDB?retryWrites=true&w=majority";

// mongoose.connect(mongoURI, {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// //  api routes

// app.get("/", (req, res) => res.status(200).send("hello world"));

// app.post("/new/channel", (req, res) => {
//   const dbData = req.body;
//   mongoData.create(dbData, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });
// });

// app.get("/get/channelList", (req, res) => {
//   mongoData.find((err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       let channels = [];

//       data.map((channelData) => {
//         const channelInfo = {
//           id: channelData._id,
//           name: channelData.channelName,
//         };
//         channels.push(channelInfo);
//       });
//       res.status(200).send(channels);
//     }
//   });
// });

// app.post("/new/message", (req, res) => {
//   //   const id = req.query.id;
//   const newMessage = req.body;

//   mongoData.update(
//     { _id: req.query.id },
//     { $push: { conversation: req.body } },
//     (err, data) => {
//       if (err) {
//         console.log("Error saving message...");
//         console.log(err);
//         res.status(500).send(err);
//       } else {
//         res.status(201).send(data);
//       }
//     }
//   );
// });

// app.get("/get/data", (req, res) => {
//   mongoData.find((err, data) => {
//     if (err) {
//       res.status(500), send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

// app.get("/get/conversation", (req, res) => {
//   const id = req.query.id;
//   mongoData.find({ _id: id }, (ee, data) => {
//     if (err) {
//       res.status(500), send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });
// //  listen

// app.listen(port, () => console.log(`listening on localhost:${port}`));
