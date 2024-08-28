require('dotenv').config({ path: require('find-config')('.env') });
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

const process = require("process");
var mysql = require("mysql");
var help = require('./commands/help');
var link = require('./commands/link');
var claim = require('./commands/claim');
var stats = require('./commands/stats');
const deposit = require("./commands/deposit");
const balance = require("./commands/balance");
var con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_KEY,
  port: process.env.MYSQL_PORT
});
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
  if (mainInteraction.member.roles.cache.some(role => role.name === 'HashCraft Verified') || mainInteraction.member.roles.cache.some(role => role.name === '⚠ UNVERIFIED ⚠')) {
    switch (mainInteraction.commandName) {
      case "help":
        help.send(mainInteraction);
        setTimeout(() => {client.user.setPresence({ status: 'idle' });}, 10000);
        break;
      case "stats":
        stats.send(mainInteraction);
        setTimeout(() => {client.user.setPresence({ status: 'idle' });}, 10000);
        break;
      case "link":
        link.start(mainInteraction, mainInteraction.user.id, con, client);
        break;
      case 'claim':
        claim.drop(mainInteraction, mainInteraction.user.id, con);
        setTimeout(() => {client.user.setPresence({ status: 'idle' });}, 10000);
        break;
        case 'deposit':
          deposit.transfer(mainInteraction, mainInteraction.user.id, con);
          setTimeout(() => {client.user.setPresence({ status: 'idle' });}, 10000);
          break;
        case 'balance':
          balance.check(mainInteraction, mainInteraction.user.id, con);
          setTimeout(() => {client.user.setPresence({ status: 'idle' });}, 10000);
          break;
    }
  } else {
    const verify = new EmbedBuilder().setTitle("User not verified").setColor(0xff0000).setDescription("Whoa there, we don't know whether you're a human or not.\nVerify yourself in the <#1267862884072030208> channel").setFooter({ text: "HashCraft v" + process.env.BOT_VERSION, iconURL: process.env.ICON }).setTimestamp();
    await mainInteraction.reply({ embeds: [verify] });
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