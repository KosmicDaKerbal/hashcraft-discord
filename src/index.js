require("dotenv").config();
const ver = 0.3;
const ico = "https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png";
const {
  Client,
  IntentsBitField,
  InteractionCollector,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const http = require("http");
const process = require("process");
var mysql = require("mysql");
var con = mysql.createConnection({
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
            name: "/faucet",
            value:
              "Link your DuinoCoin Wallet to this server's exclusive faucet.",
            inline: true,
          }
        )
        .setFooter({ text: "Duino-Coin Ecosystem v" + ver, iconURL: ico })
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
        .setFooter({ text: "Duino-Coin Ecosystem v" + ver, iconURL: ico })
        .setTimestamp();
      await mainInteraction.reply({ embeds: [stats] });
      break;
    case "faucet":
      const confirmbox = new EmbedBuilder()
        .setTitle("Link Account to User")
        .setDescription("Please Wait...\nConnecting to DB...")
        .setColor(0xff0000)
        .setFooter({ text: "Duino-Coin Ecosystem v" + ver, iconURL: ico })
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
      const choice = new ActionRowBuilder().addComponents(cancel, confirm);
      const accountRemove = new ActionRowBuilder().addComponents(remove);
      await mainInteraction.reply({ embeds: [confirmbox] });
      const filter = (i) => i.user.id === mainInteraction.user.id;

      con.connect(async function (err) {
        if (err) throw err;
        confirmbox.setDescription(
          "Please Wait...\nConnected to DB.\nQuerying Account Link..."
        );
        await mainInteraction.editReply({ embeds: [confirmbox] });
        con.query(
          `insert into Faucet (userid) values (${u}) on duplicate key update userid = ${u}`,
          function (err, result) {
            if (err) throw err;
            con.query(
              `select wallet_name from Faucet where userid = ${u}`,
              async function (err, result) {
                if (err) throw err;
                if (result == "[object Object]") {
                  confirmbox
                    .setDescription(
                      "You have not yet Linked your DuinoCoin Account to this Server."
                    )
                    .setColor(0xff0000)
                    .setTimestamp();
                  confirm.setLabel("Link Duino-Coin Account");
                  const rep2 = await mainInteraction.editReply({
                    embeds: [confirmbox],
                    components: [choice],
                  });
                  const collector2 = rep2.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter,
                    time: 10_000,
                  });
                  collector2.on("collect", async (sqlInteraction) => {
                    switch (sqlInteraction.customId) {
                      case "confirm":
                        confirm.setDisabled(true);
                        cancel.setDisabled(true).setStyle(ButtonStyle.Secondary);
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
                                          mainInteraction.options.get("account-name")
                                            .value
                                        )
                                    )
                                    .setColor(0xffff00)
                                    .setTimestamp();
                                  const rep = await sqlInteraction.reply({
                                    embeds: [confirmbox],
                                    components: [choice],
                                  });
                                  const collector =
                                    rep.createMessageComponentCollector({
                                      componentType: ComponentType.Button,
                                      filter,
                                      time: 10_000,
                                    });
                                    console.log(collector);

                                  collector.on("collect", async (linkInteraction) => {
                                    console.log(sqlInteraction.customId);
                                    switch (linkInteraction.customId) {
                                      case "confirm":
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
                                            "Run /claim to get your daily DUCO"
                                          )
                                          .setColor(0x00ff00)
                                          .setTimestamp();
                                        cancel.setStyle(ButtonStyle.Secondary);
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
                                        confirm.setStyle(ButtonStyle.Secondary);
                                        break;
                                    }
                                    confirm.setDisabled(true);
                                    cancel.setDisabled(true);
                                    await linkInteraction.editReply({
                                      components: [choice],
                                    });
                                    await sqlInteraction.reply({ embeds: [confirmbox] });
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
                                  await sqlInteraction.editReply({
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
                            await sqlInteraction.reply({ embeds: [confirmbox] });
                          });
                        break;
                      case "cancel":
                        confirmbox
                          .setTitle(
                            "Cancelled Linking Account " +
                              String(mainInteraction.options.get("account-name").value)
                          )
                          .setDescription("Try Again?")
                          .setColor(0xff0000)
                          .setTimestamp();
                        confirm.setStyle(ButtonStyle.Secondary);
                        confirm.setDisabled(true);
                        cancel.setDisabled(true);
                        await sqlInteraction.reply({ embeds: [confirmbox] });
                    }
                  });
                } else {
                  confirmbox
                    .setDescription("Account is Already Linked: " + result)
                    .setColor(0x00ff00)
                    .setTimestamp();
                  await mainInteraction.editReply({
                    embeds: [confirmbox],
                    components: [accountRemove],
                  });
                }
              }
            );
          }
        );
      });
      break;
  }
});

console.log("Connecting...");
client.on("ready", (c) => {
  console.log("Welcome to the DuinoCoin Ecosystem.");
});
client.login(process.env.TOKEN);
