require('dotenv').config({ path: require('find-config')('.env') });
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const process = require("process");
const mysql = require("mysql");
const help = require('./commands/help');
const link = require('./commands/link');
const claim = require('./commands/claim');
const stats = require('./commands/stats');
const deposit = require("./commands/deposit");
const balance = require("./commands/balance");
const slowmode = require("./commands/slowmode");
const purge = require("./commands/purge");
const restart = require('./commands/restart');
const modbal = require('./commands/modbal');
const mdu = require('./commands/pay');
const flist = require('./commands/faucetlist');
const con = mysql.createPool({
  multipleStatements: true,
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
var rbt;
client.on("interactionCreate", async (mainInteraction) => {
  if (!mainInteraction.isChatInputCommand()) return;
  client.user.setPresence({ status: 'online' });
  if (mainInteraction.member.roles.cache.some(role => role.name === process.env.VERIFIED_ROLE)) {
      switch (mainInteraction.commandName) {
        case "help":
          help.send(mainInteraction);
          break;
        case "stats":
          stats.send(mainInteraction);
          break;
        case 'faucetlist':
          flist.send(mainInteraction);
          break;
        case "link":
          link.start(mainInteraction, mainInteraction.user.id, con, client); //yes this is a sword art online reference
          break;
        case 'claim':
          claim.drop(mainInteraction, mainInteraction.user.id, con);
          break;
        case 'deposit':
          deposit.transfer(mainInteraction, mainInteraction.user.id, con);
          break;
        case 'balance':
          balance.check(mainInteraction, mainInteraction.user.id, con);
          break;
        case 'pay':
          mdu.pay(mainInteraction, mainInteraction.user.id, con);
          break;  
        default:
          if (mainInteraction.member.roles.cache.some(role => role.name === process.env.SERVER_OWNER) || mainInteraction.member.roles.cache.some(role => role.name === process.env.MODERATOR)) {
            switch (mainInteraction.commandName) {
              case 'slowmode':
                slowmode.set(mainInteraction);
                break;
              case 'purge':
                purge.execute(mainInteraction);
                break;
              case 'restart':
                const reboot = await restart.execute(mainInteraction);
                if (reboot){
                  rbt = reboot;
                  client.user.setStatus('invisible');
                  setTimeout(async () => { await client.destroy(); process.exit(22) }, 15000);
                }
              break;
              case 'modbal':
                modbal.modify (mainInteraction, con);
              break;
            }
          } else {
            index.setTitle("Nice try, pleb").setColor(0xff0000).setDescription("You cannot use admin commands when you're not one, duh.").setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
            await mainInteraction.reply({ embeds: [index], ephemeral: true });
          }
          break;
      }
  } else {
    index.setTitle("User not verified").setColor(0xff0000).setDescription(`Whoa there, we don't know whether you're a human or not.\nVerify yourself in the <#${process.env.VERIFICATION_CHANNEL}> channel`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    await mainInteraction.reply({ embeds: [index] });
  }
  if (!rbt){
    setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
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