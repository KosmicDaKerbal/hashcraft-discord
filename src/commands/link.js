const process = require("process");
const http = require("http");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
  } = require("discord.js");
module.exports = {
start: async function (embed, userid, con, client){
    const u = userid;
    const confirmbox = new EmbedBuilder()
        .setTitle("Link Account to User")
        .setDescription("Please Wait...\nConnecting to DB...")
        .setColor(0xff0000)
        .setFooter({ text: "HashCraft v" + process.env.BOT_VERSION, iconURL: process.env.ICON })
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
      //await embed.editReply({ embeds: [confirmbox] });
      await embed.deferReply();
      con.getConnection(async function (err) {
        if (err) {
          confirmbox.setDescription(
            "Please Wait...\nConnecting to DB...\nInternal Server Error: Unable to connect to Faucet Database."
          );
          await embed.editReply({ embeds: [confirmbox] });
          console.log(err);
        } else {
          /*
          confirmbox.setDescription(
            "Please Wait...\nConnected to DB.\nQuerying Account Link..."
          );
          await embed.editReply({ embeds: [confirmbox] });*/
          con.query(
            `insert into Faucet (userid) values (${u}) on duplicate key update userid = ${u}`,
            async function (err, result) {
              if (err) {
                confirmbox.setDescription(
                  "Query Failed: Couldn't update UserID"
                );
                await embed.editReply({ embeds: [confirmbox] });
                console.log(err);
              } else {
                con.query(
                  `select wallet_name from Faucet where userid = ${u}`,
                  async function (err, result) {
                    if (err) {
                      confirmbox.setDescription(
                        "Query Failed: Couldn't get Wallet Name"
                      );
                      await embed.editReply({ embeds: [confirmbox] });
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
                        const filter = (i) => i.user.id === embed.user.id;
                        const rep2 = await embed.editReply({
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
                              await embed.editReply({
                                embeds: [confirmbox],
                                components: [choice],
                              });
                              await sqlInteraction.deferReply();
                              cancel.setDisabled(false).setStyle(ButtonStyle.Danger);
                              confirm.setLabel("Confirm").setDisabled(false);
                              http
                                .get(
                                  "http://server.duinocoin.com/v2/users/" +
                                  embed.options.get("account-name").value,
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
                                              embed.options.get(
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
                                        const rep = await sqlInteraction.editReply({
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
                                            await linkInteraction.deferReply();
                                            switch (linkInteraction.customId) {
                                              case "confirm":
                                                cancel.setStyle(ButtonStyle.Secondary);
                                                con.query(
                                                  `insert into Faucet(userid, wallet_name) values (${u}, '${String(embed.options.get("account-name").value)}') on duplicate key update userid = ${u}, wallet_name = '${String(embed.options.get("account-name").value)}';`,
                                                  async function (err, result) {
                                                    if (err) {
                                                      confirmbox.setDescription.setTitle(
                                                        "Link " +
                                                        String(
                                                          embed.options.get(
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
                                                            embed.options.get(
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
                                                      embed.options.get(
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
                                              components: [choice2],
                                            });
                                            await linkInteraction.editReply({
                                              embeds: [confirmbox],
                                            });
                                          }
                                        );
                                        collector.on("end", async () => {
                                          confirm.setDisabled(true);
                                          cancel.setDisabled(true);
                                          client.user.setPresence({ status: 'idle' });
                                          await sqlInteraction.editReply({
                                            components: [choice2],
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
                                  await sqlInteraction.editReply({
                                    embeds: [confirmbox],
                                  });
                                });
                              break;
                            case "cancel":  
                              confirmbox
                                .setTitle(
                                  "Cancelled Linking Account " +
                                  String(
                                    embed.options.get("account-name")
                                      .value
                                  )
                                )
                                .setDescription("Try Again?")
                                .setColor(0xff0000)
                                .setTimestamp();
                              confirm.setDisabled(true).setStyle(ButtonStyle.Secondary);;
                              cancel.setDisabled(true).setStyle(ButtonStyle.Danger);
                              await embed.editReply({
                                components: [choice]
                              });
                              await sqlInteraction.reply({ embeds: [confirmbox] });
                          }
                        });
                        collector2.on("end", async () => {
                          confirm.setLabel("Link Duino-Coin Account").setDisabled(true);
                          cancel.setDisabled(true);
                          client.user.setPresence({ status: 'idle' });
                          await embed.editReply({
                            components: [choice],
                          });
                          confirm.setLabel("Confirm");
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
                        const exists = await embed.editReply({
                          embeds: [confirmbox],
                          components: [accountRemove],
                          fetchReply: true,
                        });
                        const filter = (i) => i.user.id === embed.user.id;
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
                                remove.setStyle(
                                  ButtonStyle.Success
                                ).setDisabled(true);
                                await embed.editReply({ components: [accountRemove] });
                                con.query(
                                  `update Faucet set wallet_name = null where Faucet.userid = ${u}`,
                                  async function (err, result) {
                                    await existsInteraction.deferReply();
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
                                    
                                    await existsInteraction.editReply({ embeds: [confirmbox] });
                                  });
                                break;
                            }
                          });
                        collector.on("end", async () => {
                          remove.setDisabled(true);
                          client.user.setPresence({ status: 'idle' });
                          await embed.editReply({
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
}
}