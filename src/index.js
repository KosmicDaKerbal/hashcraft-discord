require("dotenv").config();
const ver = "0.4.9 dry-run";
  const ico = "";
  const loading = "";
  const done = "";
  const notdone = "";
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

const process = require("process");
var mysql = require("mysql");
const dayjs = require('dayjs');
var help = require('./commands/help');
var link = require('./commands/link');
var claim = require('./commands/claim');
var stats = require('./commands/stats');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.on("interactionCreate", async (mainInteraction) => {
  if (!mainInteraction.isChatInputCommand()) return;
  client.user.setPresence({ status: 'online' });
  const u = mainInteraction.user.id;
  switch (mainInteraction.commandName) {
    case "help":
      help.send(mainInteraction);
      break;
    case "stats":
      stats.send(mainInteraction);
      break;
    case "link":
      link.start(mainInteraction, mainInteraction.user.id);
      break;
    case 'claim':
      claim.drop(mainInteraction, mainInteraction.user.id);
      break;
      case 'deposit':
        break;
  }
});

console.log("Connecting...");
client.on("ready", (c) => {
  console.log("Welcome to HashCraft.");
  client.user.setPresence({
    activities: [{
      name: '/help',
      type: ActivityType.Listening
    }],
    status: 'idle'
  });
});
client.login(process.env.TOKEN);