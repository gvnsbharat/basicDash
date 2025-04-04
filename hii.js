const request = require("request");
const TelegramBot = require("node-telegram-bot-api");
const admin = require("firebase-admin");

// Firebase service account credentials
const serviceAccount = require("./key.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/hi-bha/overview" // replace with your Firebase DB URL
});

const db = admin.firestore();

const token = "7170450413:AAHJ9hGhqO6ksNubzW2Yla4ppfNq3NQCS5w";
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Predict Gender", callback_data: "gender" }]
    ]
  }
};

bot.on("message", (msg) => {
  if (msg.text === "Hi") {
    bot.sendMessage(msg.chat.id, "Hi, how are you?");
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hi ${msg.chat.first_name}! Choose one from the following options:`, options);
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  if (query.data === "gender") {
    bot.sendMessage(chatId, "Please send me a name to predict the gender.");
    bot.once("message", (msg) => {
      const name = msg.text;
      generateGender(chatId, name);
    });
  }
  bot.answerCallbackQuery(query.id);
});

function generateGender(chatId, name) {
  const apiUrl = `https://api.genderize.io/?name=${name}`;

  request(apiUrl, (err, res, body) => {
    if (err) {
      bot.sendMessage(chatId, "Sorry, I couldn't fetch the gender information right now.");
      return;
    }

    const genderData = JSON.parse(body);

    if (genderData.gender) {
      const gender = genderData.gender.charAt(0).toUpperCase() + genderData.gender.slice(1);
      bot.sendMessage(chatId, `The gender predicted for the name ${name} is: ${gender}`);
      saveToFirebase(name, gender);
    } else {
      bot.sendMessage(chatId, `Sorry, I couldn't determine the gender for the name ${name}.`);
    }
  });
}

function saveToFirebase(name, gender) {
  db.collection("predictions")
    .add({
      name: name,
      gender: gender,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
console.log("Bot is running");