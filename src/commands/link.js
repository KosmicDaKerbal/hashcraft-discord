const process = require("process");
const http = require("http");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
module.exports = {
  start: async function (embed, userid, con, client) {
    const confirmbox = new EmbedBuilder().setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.PROCESSING }).setTitle("Link Account to User").setDescription("Please Wait...\nConnecting to DB...").setColor(0xff0000).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    const confirm = new ButtonBuilder().setCustomId("confirm").setLabel("Confirm").setStyle(ButtonStyle.Success).setDisabled(false);
    const cancel = new ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(ButtonStyle.Danger).setDisabled(false);
    const remove = new ButtonBuilder().setCustomId("remove").setLabel("Remove").setStyle(ButtonStyle.Danger).setDisabled(false);
    await embed.deferReply();
    if (embed.channelId === process.env.BOT_CHANNEL) {
    const u = userid;
    con.getConnection(async function (err, link) {
      if (err) {
        confirmbox.setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL });
        await embed.followUp({ embeds: [confirmbox] });
      } else {
        link.query(`insert into Faucet (userid) values (${u}) on duplicate key update userid = ${u}`, async function (err, result) {
            if (err) {
              confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL }).setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.");
              await embed.followUp({ embeds: [confirmbox] });
            } else {
              link.query(`select wallet_name from Faucet where userid = ${u}`, async function (err, result) {
                  if (err) {confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL }).setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.");
                    await embed.followUp({ embeds: [confirmbox] });
                  } else {
                    if (result[0].wallet_name === null) {
                      const choice = new ActionRowBuilder().addComponents(cancel,confirm);
                      confirmbox.setDescription("You have not yet linked your DuinoCoin Account to this server.").setColor(0xff0000).setTimestamp();
                      confirm.setLabel("Link Duino-Coin Account");
                      const filter = (i) => i.user.id === embed.user.id;
                      const rep2 = await embed.followUp({embeds: [confirmbox], components: [choice],});
                      const collector2 = rep2.createMessageComponentCollector({componentType: ComponentType.Button, filter, time: 30_000,});
                      collector2.on("collect", async (sqlInteraction) => {
                        switch (sqlInteraction.customId) {
                          case "confirm":
                            confirm.setDisabled(true);
                            cancel.setDisabled(true).setStyle(ButtonStyle.Secondary);
                            confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.SUCCESS });
                            await embed.editReply({embeds: [confirmbox], components: [choice],});
                            await sqlInteraction.deferReply();
                            cancel.setDisabled(false).setStyle(ButtonStyle.Danger);
                            confirm.setLabel("Confirm").setDisabled(false);
                            http.get("http://server.duinocoin.com/v2/users/" + embed.options.get("account-name").value, (res) => {
                                  let data = "";
                                  res.on("data", (chunk) => {data += chunk;});
                                  res.on("end", async () => {
                                    const json = JSON.parse(data);
                                    if (json.success) {
                                      confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.PROCESSING }).setDescription("Confirm Account Link: " +String(embed.options.get("account-name").value)).setColor(0xffff00).setTimestamp();
                                      const choice2 =new ActionRowBuilder().addComponents(cancel,confirm);
                                      const filter = (i) => i.user.id === sqlInteraction.user.id;
                                      const rep = await sqlInteraction.followUp({embeds: [confirmbox],components: [choice2],fetchReply: true,});
                                      const collector =rep.createMessageComponentCollector({componentType: ComponentType.Button,filter,time: 10_000,});
                                      collector.on("collect", async (linkInteraction) => {
                                          await linkInteraction.deferReply();
                                          const e1 = confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.SUCCESS });
                                          switch (linkInteraction.customId) {
                                            case "confirm":
                                              cancel.setStyle(ButtonStyle.Secondary);
                                              link.query(`insert into Faucet(userid, wallet_name) values (${u}, '${String(embed.options.get("account-name").value)}') on duplicate key update userid = ${u}, wallet_name = '${String(embed.options.get("account-name").value)}';`, async function (err, result) {
                                                  if (err) {
                                                    confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL }).setTitle("Link " +String(embed.options.get("account-name").value) +" Failed").setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000).setTimestamp();
                                                    confirm.setStyle(ButtonStyle.Secondary);
                                                    cancel.setStyle(ButtonStyle.Secondary);
                                                  } else {
                                                    confirmbox.setTitle("Linked Account " +String(embed.options.get("account-name").value) +" Successfully.").setDescription("Run /claim to get your daily ⧈ mDU").setColor(0x00ff00).setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.SUCCESS }).setTimestamp();
                                                  }
                                                }
                                              );
                                              break;
                                            case "cancel":
                                              confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL }).setTitle("Cancelled Linking Account " +String(embed.options.get("account-name").value)).setDescription("Try Again?").setColor(0xff0000).setTimestamp();
                                              confirm.setStyle(ButtonStyle.Secondary);
                                              break;
                                          }
                                          confirm.setDisabled(true);
                                          cancel.setDisabled(true);
                                          await sqlInteraction.editReply({embeds: [e1], components: [choice2]});
                                          await linkInteraction.followUp({embeds: [confirmbox]});
                                        }
                                      );
                                      collector.on("end", async () => {
                                        confirm.setDisabled(true).setStyle(ButtonStyle.Secondary);
                                        cancel.setDisabled(true).setStyle(ButtonStyle.Secondary);
                                        client.user.setPresence({ status: 'idle' });
                                        await sqlInteraction.editReply({components: [choice2]});
                                      });
                                    } else {
                                      confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL }).setDescription("Error: " + String(json.message)).setColor(0xff0000).setTimestamp();
                                      confirm.setDisabled(true);
                                      cancel.setDisabled(true);
                                      await sqlInteraction.followUp({embeds: [confirmbox]});
                                    }
                                  });
                                }
                              )
                              .on("error", async (e) => {
                                confirmbox.setAuthor({ iconURL: process.env.FAIL }).setDescription("Error while fetching API Request: ```\n" + e + "\n```").setColor(0xff0000).setTimestamp();
                                await sqlInteraction.followUp({embeds: [confirmbox]});
                              });
                            break;
                          case "cancel":
                            confirmbox.setAuthor({ name: `${process.env.BOT_NAME} Registration`, iconURL: process.env.FAIL }).setTitle("Cancelled Linking Account " + String(embed.options.get("account-name").value)).setDescription("Try Again?").setColor(0xff0000).setTimestamp();
                            await sqlInteraction.reply({ embeds: [confirmbox] });
                            confirm.setDisabled(true).setStyle(ButtonStyle.Secondary);;
                            cancel.setDisabled(true).setStyle(ButtonStyle.Danger);
                            await embed.editReply( {components: [choice]} );
                        }
                      });
                      collector2.on("end", async () => {
                        confirm.setLabel("Link Duino-Coin Account").setDisabled(true).setStyle(ButtonStyle.Secondary);
                        cancel.setDisabled(true).setStyle(ButtonStyle.Secondary);
                        client.user.setPresence({ status: 'idle' });
                        await embed.editReply({components: [choice],});
                        confirm.setLabel("Confirm");
                      });
                    } else {
                      const accountRemove = new ActionRowBuilder().addComponents(remove);
                      const name = result[0].wallet_name;
                      confirmbox.setDescription("Account is Already Linked: " + result[0].wallet_name).setColor(0xff0000).setTimestamp();
                      const exists = await embed.followUp({embeds: [confirmbox], components: [accountRemove], fetchReply: true,});
                      const filter = (i) => i.user.id === embed.user.id;
                      const collector =
                        exists.createMessageComponentCollector({componentType: ComponentType.Button, filter, time: 25_000,});
                      collector.on("collect", async (existsInteraction) => {
                          switch (existsInteraction.customId) {
                            case 'remove':
                              remove.setStyle(ButtonStyle.Success).setDisabled(true);
                              await embed.editReply({ components: [accountRemove] });
                              link.query(`update Faucet set wallet_name = null where Faucet.userid = ${u}`, async function (err, result) {
                                  await existsInteraction.deferReply();
                                  if (err) {
                                    confirmbox.setDescription.setTitle("Removing Account " + String(name) + " Failed").setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000).setTimestamp();
                                  } else {
                                    confirmbox.setTitle("Account " + String(name) + ": Unlink Successful").setDescription("We're sad to see you go :(").setColor(0x00ff00).setTimestamp();
                                  }
                                  await existsInteraction.followUp({ embeds: [confirmbox] });
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
            link.release();
          }
        );
      }
    });
  } else {
    confirmbox.setTitle("Use the correct channel dammit").setColor(0xff0000).setDescription(`You can only use this command on <#${process.env.BOT_CHANNEL}>.`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    await embed.followUp({ embeds: [confirmbox], ephemeral: true });
  }
  }
}