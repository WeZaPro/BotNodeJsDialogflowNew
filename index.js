const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.PORT || 4000;
const cors = require("cors");
const helmet = require("helmet");

//firebase
const fs = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(cors());
app.use(helmet());

// Import the appropriate class
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion, Payload } = require("dialogflow-fulfillment");

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World 1234!");
});
//=============
let payloadJson = {
  type: "sticker",
  packageId: "11538",
  stickerId: "51626513",
};
//========
const payloadData = {
  type: "template",
  altText: "this is a buttons template",
  template: {
    thumbnailImageUrl:
      "https://poisetechnology.com/wp-content/uploads/2019/01/Call-Center-Solution.png",
    title: "Contact Center",
    type: "buttons",
    actions: [
      // {
      //   uri: "https://line.me/ti/p/@934sbghq",
      //   type: "uri",
      //   label: "สอบถามข้อมูลสินค้า",
      // },
      // {
      //   uri: "https://line.me/ti/p/@510blzif",
      //   label: "ปัญหาการส่ง File",
      //   type: "uri",
      // },
      // {
      //   type: "uri",
      //   label: "ร้องเรียนปัญหาสินค้า",
      //   uri: "https://line.me/ti/p/@908ehrnf",
      // },
      {
        label: "เริ่มต้นการใช้งาน",
        // uri: "https://liff.line.me/1656824759-dzZxJlQ9",
        uri: "https://liff.line.me/1656824759-Mov40b69",
        type: "uri",
      },
    ],
    text: "กรุณาเลือก เริ่มต้นการใช้งาน เลยค่ะ",
  },
};

//---
const payloadDetail = {
  type: "template",
  altText: "this is a carousel template",
  template: {
    type: "carousel",
    imageAspectRatio: "square",
    imageSize: "cover",
    columns: [
      {
        text: "กล่องแบบมาตรฐาน มีฝาปิด-เปิดเฉพาะด้านบน ด้านล่างเป็นระบบออโต",
        thumbnailImageUrl:
          "https://onlinesabuyme.co.th/wp-content/uploads/2022/09/7587683-13-1-920x920.png",
        title: "กล่องมาตรฐานแบบ1",
        actions: [
          {
            label: "รายละเอียดสินค้า",
            type: "uri",
            uri: "https://onlinesabuyme.co.th/wp-content/uploads/2022/09/7587683-15-1-920x920.png",
          },
          {
            uri: "https://onlinesabuyme.co.th/wp-content/uploads/2022/09/1-1-1024x1024.png",
            type: "uri",
            label: "ตารางราคา",
          },
          {
            type: "uri",
            uri: "http://www.siriexpress.net/product/packaging-7/",
            label: "สั่งซื้อเลย",
          },
        ],
      },
      {
        text: "กล่องแบบมาตรฐาน มีฝาปิด-เปิดเฉพาะด้านบน ด้านล่างเป็นระบบออโต",
        actions: [
          {
            type: "message",
            text: "Action 1",
            label: "รายละเอียดสินค้า",
          },
          {
            type: "message",
            label: "ตารางราคา",
            text: "Action 2",
          },
          {
            label: "สั่งซื้อเลย",
            type: "message",
            text: "Action 3",
          },
        ],
        thumbnailImageUrl:
          "https://onlinesabuyme.co.th/wp-content/uploads/2022/09/2-1024x1024.png",
        title: "กล่องมาตรฐานแบบ2",
      },
      {
        thumbnailImageUrl:
          "https://onlinesabuyme.co.th/wp-content/uploads/2022/09/2-1024x1024.png",
        text: "กล่องแบบมาตรฐาน มีฝาปิด-เปิดเฉพาะด้านบน ด้านล่างเป็นระบบออโต",
        actions: [
          {
            type: "message",
            text: "Action 1",
            label: "รายละเอียดสินค้า",
          },
          {
            text: "Action 2",
            type: "message",
            label: "ตารางราคา",
          },
          {
            type: "message",
            label: "สั่งซื้อเลย",
            text: "Action 3",
          },
        ],
        title: "กล่องมาตรฐานแบบ3",
      },
    ],
  },
};
//========
// let payload = new Payload("LINE", payloadJson, { sendAsMessage: true });
let payload = new Payload("LINE", payloadData, { sendAsMessage: true });
let setPayloadDetail = new Payload("LINE", payloadDetail, {
  sendAsMessage: true,
});

//==========

//==========

app.post("/webhook", (req, res) => {
  //   console.log("res: /---->", res);
  //console.log("Header:--> ", req.headers);
  //console.log("Body:--> ", req.body);
  //console.log("Body: ", req.body.queryResult.fulfillmentText);
  //console.log("Req:--> ", req);

  //Create an instance
  const agent = new WebhookClient({
    request: req,
    response: res,
  });
  //console.log("agent:--> ", agent);

  //Test get value of WebhookClient
  console.log("agentVersion: " + agent.agentVersion);
  console.log("intent:---> " + agent.intent);
  console.log("query:---> " + agent.query);
  console.log("locale: " + agent.locale);
  //console.log("query:---> ", agent.query);
  console.log("session:---> ", agent.session);

  //Function Location
  // function location(agent) {
  //   agent.add("Welcome to Thailand. 555");
  // }

  async function DefaultFallbackIntent(agent) {
    const db = await fs.firestore();

    //

    let _sessionId = agent.session;
    let query = agent.query;
    const mySessionId = _sessionId.split("/", 5);
    const _inputSessionId = mySessionId[4];

    // if (query === "Contact" || query === "Detail" || query === "Phone") {
    if (query === "Start") {
      // 1.save _sessionId to db
      // agent.add("save _sessionId to db");
      agent.add("เริ่มต้นการแชท ได้เลยค่ะ");

      const usersDb = db.collection("users");
      const sessionID = usersDb.doc(_inputSessionId);
      await sessionID.set({
        sessionID: _inputSessionId,
      });

      // agent.add("--------1");
    } else {
      const _getSessionId = await db
        .collection("users")
        .doc(_inputSessionId)
        .get();

      console.log("_getSessionId---> ", _getSessionId);

      if (_getSessionId._fieldsProto == undefined) {
        agent.add("--------No DB");
        agent.add(payload);
      } else {
        // agent.add("--------Have DB");

        const getSessionIdFromDb =
          _getSessionId._fieldsProto.sessionID.stringValue;

        if (_inputSessionId === getSessionIdFromDb) {
          agent.add("");
        } else {
          agent.add(payload);
        }
      }
    }
  }

  async function Detail(agent) {
    const db = await fs.firestore();
    console.log("Detail---> ");
    let _sessionId = agent.session;
    let query = agent.query;
    const mySessionId = _sessionId.split("/", 5);
    const _inputSessionId = mySessionId[4];

    // 1.Find session in db
    // 2.if true =>  agent.add(payloadDetail);
    // false => save to db => agent.add(payloadDetail);

    // find db ************
    const _getSessionId = await db
      .collection("users")
      .doc(_inputSessionId)
      .get();
    // find not found
    if (_getSessionId._fieldsProto == undefined) {
      //agent.add("--------No DB");
      // agent.add("--------Save DB");
      // const usersDb = db.collection("users");
      // const sessionID = usersDb.doc(_inputSessionId);
      // await sessionID.set({
      //   sessionID: _inputSessionId,
      // });

      //agent.add("--------Goto Start");
      agent.add(payload);
    } else {
      // find  found
      //agent.add("--------Have DB");
      const getSessionIdFromDb =
        _getSessionId._fieldsProto.sessionID.stringValue;

      if (_inputSessionId === getSessionIdFromDb) {
        //agent.add("--------TODO");
        agent.add(setPayloadDetail);
      } else {
        agent.add("--------NOT FOUND");
      }
    }

    // ---old

    // if (query === "Detail") {
    //   // 1.save _sessionId to db
    //   agent.add("save _sessionId to db");

    //   // save db ************
    //   const usersDb = db.collection("users");
    //   const sessionID = usersDb.doc(_inputSessionId);
    //   await sessionID.set({
    //     sessionID: _inputSessionId,
    //   });

    //   agent.add("--------1");
    //   agent.add(payloadDetail);
    // } else {
    //   // find db ************
    //   const _getSessionId = await db
    //     .collection("users")
    //     .doc(_inputSessionId)
    //     .get();
    //   // find not found
    //   if (_getSessionId._fieldsProto == undefined) {
    //     agent.add("--------No DB");
    //     agent.add(payload);
    //   } else {
    //     // find  found
    //     agent.add("--------Have DB");
    //     const getSessionIdFromDb =
    //       _getSessionId._fieldsProto.sessionID.stringValue;

    //     if (_inputSessionId === getSessionIdFromDb) {
    //       agent.add("--------TODO");
    //       agent.add(payloadDetail);
    //     } else {
    //       agent.add("--------NOT FOUND");
    //     }
    //   }
    // }
  }

  let intentMap = new Map();

  intentMap.set("Detail", Detail);

  intentMap.set("Default Fallback Intent", DefaultFallbackIntent);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
