const process = require("process");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
module.exports = {
    pay: async function (embed, userid, con) {
        await embed.deferReply();
        const uid = embed.options.get("mdu-recipient").value;
        const txnamt = embed.options.get("mdu-amount").value;
        const payembed = new EmbedBuilder().setTitle("Confirm Payment").setColor(0xf18701).setAuthor({ name: `${process.env.BOT_NAME} Payments`, iconURL: process.env.PROCESSING }).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp().setDescription(`Pay \`⧈${txnamt}\` to <@${uid}>?`);
        const payconfirm = new ButtonBuilder()
        .setCustomId("payconfirm")
        .setLabel("Confirm ⧈ mDU Payment")
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);
        const cancel = new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false);
        const filter = (i) => i.user.id === embed.user.id;
        const paycomponents = new ActionRowBuilder().addComponents(cancel, payconfirm);
        con.getConnection(async function (err, paycon) {
            if (err) {
            payembed.setAuthor({ name: process.env.BOT_NAME + ' Payments', iconURL: process.env.FAIL }).setTitle("Error: Unable to connect to DB.").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
            await embed.followUp({ embeds: [payembed] });
            } else {
              paycon.query(`insert into Faucet (userid) values (${userid}) on duplicate key update userid = ${userid};\nselect wallet_name, mdu_bal from Faucet where userid = ${userid};`, [1, 2], async function (err, result) {
                  if (!err) {
                    if (result[0].wallet_name == null) {
                        payembed.setAuthor({ name: process.env.BOT_NAME + ' Payments', iconURL: process.env.FAIL }).setTitle(`Account not linked yet`).setDescription(`You haven't linked your Duino-Coin Account to this discord user. Run /link to do so.`).setColor(0xff0000);
                        await embed.followUp({ embeds: [payembed] });
                      } else {
                        const userbal = result[1].mdu_bal;
                        if (userbal >= txnamt){
                        const paycheck = await embed.followUp({ embeds: [payembed], components: [paycomponents]});
                        const paycollector = paycheck.createMessageComponentCollector({componentType: ComponentType.Button, filter, time: 15_000,});
                          paycollector.on("collect", async (payInteraction) => {
                            if (payInteraction.customId == 'payconfirm'){
                                cancel.setDisabled(true).setStyle(ButtonStyle.Secondary);
                                payconfirm.setDisabled(true);
                                await embed.editReply({embeds: [payembed], components: [paycomponents],});
                                await payInteraction.deferReply();
                                paycon.query( `update Faucet set mdu_bal = mdu_bal - ${txnamt} where Faucet.userid = ${userid}; update Faucet set mdu_bal = mdu_bal + ${txnamt} where Faucet.userid = ${uid};`,
                                    async function (err) {
                                      if (!err) {
                                        payembed.setAuthor({ name: `${process.env.BOT_NAME} Payments`, iconURL: process.env.SUCCESS }).setColor(0x00ff00).setTitle("Payment Successful").setDescription(`Paid \`⧈${txnamt}\` to <@${uid}>.`).setTimestamp();
                                        await payInteraction.reply({ embeds: [payembed] });
                                      } else {
                                        payembed.setTitle("DB Query Failed, Please try again.").setDescription(`Error: \n\`\`\`\n${err}\n\`\`\``).setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Payments', iconURL: process.env.FAIL });
                                        await payInteraction.followUp({ embeds: [payembed] });
                                      }
                                    }); 
                            } else if (payInteraction.customId == 'cancel'){
                                payembed.setAuthor({ name: `${process.env.BOT_NAME} Payments`, iconURL: process.env.FAIL }).setColor(0xff0000).setTitle("Payment Canceled").setDescription(`Payment Cancelled by <@${userid}>.`).setTimestamp();
                                await payInteraction.reply({ embeds: [payembed] });
                            }
                        });
                        paycollector.on("end", async () => {
                            payconfirm.setDisabled(true);
                            cancel.setDisabled(true);
                            await embed.editReply({
                                components: [paycomponents],
                              });
                        });
                        } else {
                            payembed.setTitle("You don't have enough ⧈ mDU!").setDescription(`Current Balance: \`⧈${userbal}\``).setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Payments', iconURL: process.env.FAIL });
                            await embed.followUp({ embeds: [payembed] });
                        }
                    }
                  } else {
                    payembed.setTitle("DB Query Failed, Please try again.").setDescription(`Error: \n\`\`\`\n${err}\n\`\`\``).setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Payments', iconURL: process.env.FAIL });
                    await embed.followUp({ embeds: [payembed] });
                  }
                });
            }
            paycon.release();
        });
    }}