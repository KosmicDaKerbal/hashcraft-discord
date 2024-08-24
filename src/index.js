require("dotenv").config();
const ver = "0.4.8 unstable";
const ico = "https://i.postimg.cc/dVvZgrNp/Hash-Craft-Logo.png";
const loading = "https://media.tenor.com/-n8JvVIqBXkAAAAM/dddd.gif";
const done = "https://discord.com/assets/27311c5caafe667efb19.svg";
const {
  Client,
  IntentsBitField,
  InteractionCollector,
  EmbedBuilder,
  ActivityType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const http = require("http");
const process = require("process");
var mysql = require("mysql");
const dayjs = require('dayjs');
var isYesterday = require("dayjs/plugin/isYesterday");
var con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_KEY,
  database: process.env.MYSQL_DB,
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
  client.user.setPresence({status: 'online'});
  const u = mainInteraction.user.id;
  switch (mainInteraction.commandName) {
    case "help":
      const help = new EmbedBuilder()
        .setTitle("Help Section")
        .setColor(0xf18701)
        .addFields(
          {
            name: "/help",
            value: "Complete Commands List for the Bot.",
            inline: true,
          },
          {
            name: "/stats",
            value: "Display Information about the Bot and Server",
            inline: true,
          },
          {
            name: "/link",
            value:
              "Link your DuinoCoin Wallet to this server's exclusive faucet.",
            inline: true,
          },
          {
            name: "Donate",
            value:
              "Support me by Donating to my BAN wallet (It's easier for transactions). Even a small amount would suffice.",
          }
        )
        .setImage("https://i.postimg.cc/jdPyG88s/banano.jpg")
        .setFooter({ text: "HashCraft v" + ver, iconURL: ico })
        .setTimestamp();
      await mainInteraction.reply({ embeds: [help] });
      break;
    case "stats":
      var ram = 0;
      for (const [key, value] of Object.entries(process.memoryUsage())) {
        ram = ram + value / 1000000;
      }
      ram = Math.round(ram);
      const stats = new EmbedBuilder()
        .setTitle("Bot Statistics")
        .setColor(0xf18701)
        .addFields(
          { name: "Host", value: "AlwaysData", inline: true },
          { name: "Database", value: "MySQL", inline: true },
          { name: "RAM Usage", value: ram + "MB", inline: true }
        )
        .setFooter({ text: "HashCraft v" + ver, iconURL: ico })
        .setTimestamp();
      await mainInteraction.reply({ embeds: [stats] });
      break;
    case "link":
      const confirmbox = new EmbedBuilder()
        .setTitle("Link Account to User")
        .setDescription("Please Wait...\nConnecting to DB...")
        .setColor(0xff0000)
        .setFooter({ text: "HashCraft v" + ver, iconURL: ico })
        .setTimestamp();
      const confirm = new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);
      const cancel = new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false);
      const remove = new ButtonBuilder()
        .setCustomId("remove")
        .setLabel("Remove")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false);
      await mainInteraction.reply({ embeds: [confirmbox] });
      con.getConnection(async function (err) {
        if (err) {
          confirmbox.setDescription(
            "Please Wait...\nConnecting to DB...\nInternal Server Error: Unable to connect to Faucet Database."
          );
          await mainInteraction.editReply({ embeds: [confirmbox] });
          console.log(err);
        } else {
          confirmbox.setDescription(
            "Please Wait...\nConnected to DB.\nQuerying Account Link..."
          );
          await mainInteraction.editReply({ embeds: [confirmbox] });
          con.query(
            `insert into Faucet (userid) values (${u}) on duplicate key update userid = ${u}`,
            async function (err, result) {
              if (err) {
                confirmbox.setDescription(
                  "Please Wait...\nConnected to DB.\nQuerying Account Link...\nQuery Failed: Couldn't update UserID"
                );
                await mainInteraction.editReply({ embeds: [confirmbox] });
                console.log(err);
              } else {
                con.query(
                  `select wallet_name from Faucet where userid = ${u}`,
                  async function (err, result) {
                    if (err) {
                      confirmbox.setDescription(
                        "Please Wait...\nConnected to DB.\nQuerying Account Link...\nQuery Failed: Couldn't get Wallet Name"
                      );
                      await mainInteraction.editReply({ embeds: [confirmbox] });
                      console.log(err);
                    } else {
                      if (result[0].wallet_name === null) {
                        const choice = new ActionRowBuilder().addComponents(
                          cancel,
                          confirm
                        );
                        confirmbox
                          .setDescription(
                            "You have not yet linked your DuinoCoin Account to this server."
                          )
                          .setColor(0xff0000)
                          .setTimestamp();

                        confirm.setLabel("Link Duino-Coin Account");
                        const filter = (i) => i.user.id === mainInteraction.user.id;
                        const rep2 = await mainInteraction.editReply({
                          embeds: [confirmbox],
                          components: [choice],
                        });
                        const collector2 = rep2.createMessageComponentCollector({
                          componentType: ComponentType.Button,
                          filter,
                          time: 30_000,
                        });
                        collector2.on("collect", async (sqlInteraction) => {
                          switch (sqlInteraction.customId) {
                            case "confirm":
                              confirm.setDisabled(true);
                              cancel
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Secondary);
                              await mainInteraction.editReply({
                                embeds: [confirmbox],
                                components: [choice],
                              });
                              cancel.setDisabled(false).setStyle(ButtonStyle.Danger);
                              confirm.setLabel("Confirm").setDisabled(false);
                              http
                                .get(
                                  "http://server.duinocoin.com/v2/users/" +
                                  mainInteraction.options.get("account-name").value,
                                  (res) => {
                                    let data = "";
                                    res.on("data", (chunk) => {
                                      data += chunk;
                                    });
                                    res.on("end", async () => {
                                      const json = JSON.parse(data);

                                      if (json.success) {
                                        confirmbox
                                          .setDescription(
                                            "Confirm Account Link: " +
                                            String(
                                              mainInteraction.options.get(
                                                "account-name"
                                              ).value
                                            )
                                          )
                                          .setColor(0xffff00)
                                          .setTimestamp();
                                        const choice2 =
                                          new ActionRowBuilder().addComponents(
                                            cancel,
                                            confirm
                                          );
                                        const filter = (i) => i.user.id === sqlInteraction.user.id;
                                        const rep = await sqlInteraction.reply({
                                          embeds: [confirmbox],
                                          components: [choice2],
                                          fetchReply: true,
                                        });
                                        const collector =
                                          rep.createMessageComponentCollector({
                                            componentType: ComponentType.Button,
                                            filter,
                                            time: 10_000,
                                          });
                                        collector.on(
                                          "collect",
                                          async (linkInteraction) => {
                                            switch (linkInteraction.customId) {
                                              case "confirm":
                                                cancel.setStyle(ButtonStyle.Secondary);
                                                con.query(
                                                  `insert into Faucet(userid, wallet_name) values (${u}, '${String(mainInteraction.options.get("account-name").value)}') on duplicate key update userid = ${u}, wallet_name = '${String(mainInteraction.options.get("account-name").value)}';`,
                                                  async function (err, result) {
                                                    if (err) {
                                                      confirmbox.setDescription.setTitle(
                                                        "Link " +
                                                        String(
                                                          mainInteraction.options.get(
                                                            "account-name"
                                                          ).value
                                                        ) +
                                                        " Failed"
                                                      )
                                                        .setDescription(
                                                          "An internal error occured while connecting to the database."
                                                        )
                                                        .setColor(0xff0000)
                                                        .setTimestamp();
                                                      confirm.setStyle(
                                                        ButtonStyle.Secondary
                                                      );
                                                      cancel.setStyle(
                                                        ButtonStyle.Secondary
                                                      );
                                                      console.log(err);
                                                    } else {
                                                      confirmbox
                                                        .setTitle(
                                                          "Linked Account " +
                                                          String(
                                                            mainInteraction.options.get(
                                                              "account-name"
                                                            ).value
                                                          ) +
                                                          " Successfully."
                                                        )
                                                        .setDescription(
                                                          "Run /claim to get your daily ⧈ mDU"
                                                        )
                                                        .setColor(0x00ff00)
                                                        .setTimestamp();
                                                    }
                                                  }
                                                );
                                                break;
                                              case "cancel":
                                                confirmbox
                                                  .setTitle(
                                                    "Cancelled Linking Account " +
                                                    String(
                                                      mainInteraction.options.get(
                                                        "account-name"
                                                      ).value
                                                    )
                                                  )
                                                  .setDescription("Try Again?")
                                                  .setColor(0xff0000)
                                                  .setTimestamp();
                                                confirm.setStyle(
                                                  ButtonStyle.Secondary
                                                );
                                                break;
                                            }
                                            confirm.setDisabled(true);
                                            cancel.setDisabled(true);
                                            await sqlInteraction.editReply({
                                              components: [choice],
                                            });
                                            await linkInteraction.reply({
                                              embeds: [confirmbox],
                                            });
                                          }
                                        );
                                        collector.on("end", async () => {
                                          confirm.setDisabled(true);
                                          cancel.setDisabled(true);
                                          client.user.setPresence({status: 'idle'});
                                            await sqlInteraction.editReply({
                                              components: [choice],
                                            });
                                        });
                                      } else {
                                        confirmbox
                                          .setDescription(
                                            "Error: " + String(json.message)
                                          )
                                          .setColor(0xff0000)
                                          .setTimestamp();
                                        confirm.setDisabled(true);
                                        cancel.setDisabled(true);
                                        await sqlInteraction.reply({
                                          embeds: [confirmbox],
                                        });
                                      }
                                    });
                                  }
                                )
                                .on("error", async (e) => {
                                  confirmbox
                                    .setDescription(
                                      "Error while fetching API Request: ```\n" +
                                      e +
                                      "\n```"
                                    )
                                    .setColor(0xff0000)
                                    .setTimestamp();
                                  await sqlInteraction.reply({
                                    embeds: [confirmbox],
                                  });
                                });
                              break;
                            case "cancel":
                              confirmbox
                                .setTitle(
                                  "Cancelled Linking Account " +
                                  String(
                                    mainInteraction.options.get("account-name")
                                      .value
                                  )
                                )
                                .setDescription("Try Again?")
                                .setColor(0xff0000)
                                .setTimestamp();
                              confirm.setDisabled(true).setStyle(ButtonStyle.Secondary);;
                              cancel.setDisabled(true).setStyle(ButtonStyle.Danger);
                              await mainInteraction.editReply({
                                components: [choice]
                              });
                              await sqlInteraction.reply({ embeds: [confirmbox] });
                          }
                        });
                        collector2.on("end", async () => {
                          confirm.setDisabled(true);
                          cancel.setDisabled(true);
                          client.user.setPresence({status: 'idle'});
                            await mainInteraction.editReply({
                              components: [choice],
                            });
                        });
                      } else {
                        const accountRemove = new ActionRowBuilder().addComponents(
                          remove
                        );
                        const name = result[0].wallet_name;
                        confirmbox
                          .setDescription("Account is Already Linked: " + result[0].wallet_name)
                          .setColor(0xff0000)
                          .setTimestamp();
                        const exists = await mainInteraction.editReply({
                          embeds: [confirmbox],
                          components: [accountRemove],
                          fetchReply: true,
                        });
                        const filter = (i) => i.user.id === mainInteraction.user.id;
                        const collector =
                          exists.createMessageComponentCollector({
                            componentType: ComponentType.Button,
                            filter,
                            time: 25_000,
                          });
                        collector.on(
                          "collect",
                          async (existsInteraction) => {
                            switch (existsInteraction.customId) {
                              case 'remove':
                                con.query(
                                  `update Faucet set wallet_name = null where Faucet.userid = ${u}`,
                                  async function (err, result) {
                                    if (err) {
                                      confirmbox.setDescription.setTitle(
                                        "Removing Account " +
                                        String(name) +
                                        " Failed"
                                      )
                                        .setDescription(
                                          "An internal error occured while querying the database."
                                        )
                                        .setColor(0xff0000)
                                        .setTimestamp();
                                      console.log(err);
                                    } else {
                                      confirmbox.setTitle(
                                        "Account " +
                                        String(name) +
                                        ": Unlink Successful"
                                      )
                                        .setDescription(
                                          "We're sad to see you go :("
                                        )
                                        .setColor(0x00ff00)
                                        .setTimestamp();
                                    }
                                    remove.setStyle(
                                      ButtonStyle.Success
                                    ).setDisabled(true);
                                    await mainInteraction.editReply({ components: [accountRemove] });
                                    await existsInteraction.reply({ embeds: [confirmbox] });
                                  });
                                break;
                            }
                          });
                          collector.on("end", async () => {
                            remove.setDisabled(true);
                            client.user.setPresence({status: 'idle'});
                              await mainInteraction.editReply({
                                components: [accountRemove],
                              });
                          });
                      }
                    }
                  }
                );
              }
            }
          );
        }
      });
      break;
      case 'claim':
        const claimbox = new EmbedBuilder()
        .setTitle({ text: "HashCraft Faucet" + ver, iconURL: loading })
        .setDescription("Please Wait...")
        .setColor(0xff0000)
        .setFooter({ text: "HashCraft v" + ver, iconURL: ico })
        .setTimestamp();
        con.getConnection(async function (err) {
          if (err) {
            claimbox.setDescription(
              "Internal Server Error: Unable to connect to Faucet Database."
            );
            await mainInteraction.editReply({ embeds: [claimbox] });
            console.log(err);
          } else {
            await mainInteraction.editReply({ embeds: [claimbox] });
            const claimtime = dayjs().format('YYYY-MM-DD');
            con.query(
              `select streak, last_used from Faucet where userid = ${u}`,
              async function (err, result) {
              if (!err){
                const streak = result[0].streak;
                const use = result[0].last_used;
                if (dayjs(use).isYesterday){
                  if (streak <= 100){
                    const drop = Math.ceil(((streak * streak)/125)+10);
                  } else {
                    const drop = 100;
                  }
                }
              }
              });
            }
          });
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