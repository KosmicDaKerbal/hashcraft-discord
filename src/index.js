require('dotenv').config({ path: require('find-config')('.env') });
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require("discord.js");
const process = require("process");
const mysql = require("mysql");
const dayjs = require('dayjs');
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
  if (mainInteraction.guild === null){
    index.setTitle("Invalid Interaction").setColor(0xff0000).setDescription(`Ew why are you sliding into my DM's\nThese commands are only usable in the ${process.env.BOT_NAME} Server`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    await mainInteraction.reply({ embeds: [index] });
  } else {
    if (mainInteraction.member.roles.cache.some(role => role.name === process.env.VERIFIED_ROLE)) {
      switch (mainInteraction.commandName) {
        case "help":
          help.send(mainInteraction);
          break;
        case "stats":
          stats.send(mainInteraction, con);
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
  }
  if (!rbt){
    setTimeout(() => { client.user.setPresence({ status: 'idle' }); }, 10000);
  }
});
console.log("Connecting...");
client.on("ready", async (c) => {
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
module.exports = {
  notify: async function(){
    const time = dayjs();
    const guild = client.guilds.get(process.env.GUILD_ID);
    index.setTitle("Reminder to Claim!").setColor(0x00ff00).setDescription(`You might lose your streak!\nHead on over to <#${process.env.BOT_CHANNEL}> to claim your daily drop.`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    con.getConnection(async function (err, dm) {
      if (err) console.log(err); else {
        dm.query(`select userid from Faucet where last_used != '${time.format("YYYY-MM-DD")}'`, async function (err, result) {
          if (err) console.log(err); else {
            const list = result;
            await client.users.send("898957399677878332", { embeds: [index] });
            for (i = 0; i <= (list.length - 1); i++){
              if (guild.member(list[i].userid)){
                console.log(i);
              }
              //await client.users.send(list[i].userid, { embeds: [index] });
            }
          }
        });
      }
      dm.release();
    });
  }
}