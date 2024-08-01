const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptons } = require("./options");
require("dotenv").config();

const token = process.env.BOT_TOKEN;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "I'm going to give you a random number from 0 to 9."
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Try to guess it!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "This is a command to see the default greeting text.",
    },
    {
      command: "/description",
      description: "This is a command to see the description of this bot.",
    },
    {
      command: "/game",
      description: "This is a command to play a number guessing game.",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, "Welcome!");
    }

    if (text === "/description") {
      return bot.sendMessage(chatId, "Hello! This is a test bot.");
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(
      chatId,
      "I can't undersand you! Try a different command!"
    );
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Congrats! The number was ${chats[chatId]} indeed!`,
        againOptons
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Unlucky, the number was ${chats[chatId]}.`,
        againOptons
      );
    }
  });
};

start();
