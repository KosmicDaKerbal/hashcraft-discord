require('dotenv').config({ path: require('find-config')('.env') });
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
var hit = 0;
const process = require("process");
const mysql = require("mysql");
const http = require("http");
const help = require('./commands/help');
const link = require('./commands/link');
const claim = require('./commands/claim');
const stats = require('./commands/stats');
const deposit = require("./commands/deposit");
const balance = require("./commands/balance");
const slowmode = require("./commands/slowmode");
const purge = require("./commands/purge");
const restart = require('./commands/restart');
const con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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
const index = new EmbedBuilder();
client.on("interactionCreate", async (mainInteraction) => {
  if (!mainInteraction.isChatInputCommand()) return;
  client.user.setPresence({ status: 'online' });
  if (mainInteraction.member.roles.cache.some(role => role.name === process.env.VERIFIED_ROLE)) {
    if (mainInteraction.channelId === process.env.BOT_CHANNEL) {
      switch (mainInteraction.commandName) {
        case "help":
          help.send(mainInteraction);
          setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
          break;
        case "stats":
          stats.send(mainInteraction);
          setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
          break;
        case "link":
          link.start(mainInteraction, mainInteraction.user.id, con, client);
          break;
        case 'claim':
          claim.drop(mainInteraction, mainInteraction.user.id, con);
          setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
          break;
        case 'deposit':
          deposit.transfer(mainInteraction, mainInteraction.user.id, con);
          setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
          break;
        case 'balance':
          balance.check(mainInteraction, mainInteraction.user.id, con);
          setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
          break;
        default:
          if (mainInteraction.member.roles.cache.some(role => role.name === (process.env.SERVER_OWNER || role.name === process.env.MODERATOR))) {
            switch (mainInteraction.commandName) {
              case 'slowmode':
                slowmode.set(mainInteraction);
                setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
                break;
              case 'purge':
                purge.execute(mainInteraction);
                setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
                break;
              case 'restart':
                restart.execute(mainInteraction, hit);
                break; 
            }
          } else {
            index.setTitle("Nice try, pleb").setColor(0xff0000).setDescription("You cannot use admin commands when you're not one, duh.").setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
            await mainInteraction.reply({ embeds: [index], ephemeral: true });
          }
          break;
      }
    } else {
      index.setTitle("Use the correct channel dammit").setColor(0xff0000).setDescription(`You can only use HashCraft on <#${process.env.BOT_CHANNEL}>.`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
      await mainInteraction.reply({ embeds: [index], ephemeral: true });
    }
  } else {
    index.setTitle("User not verified").setColor(0xff0000).setDescription(`Whoa there, we don't know whether you're a human or not.\nVerify yourself in the <#${process.env.VERIFICATION_CHANNEL}> channel`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    await mainInteraction.reply({ embeds: [index] });
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
http.createServer(function(req, res){
  hit = hit + 1;
  if (hit >= (process.env.RESTART * 20)){
    process.exit(22);
  }
  res.write(`Bot is Working!\nHit: ${(hit + 1)/2}`);
  res.end();
}).listen(8091);;