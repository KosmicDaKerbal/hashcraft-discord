const {EmbedBuilder} = require("discord.js");
const process = require("process");
const http = require("http");

module.exports = {
  transfer: async function (embed, userid, con) {
    await embed.deferReply();
    const deposit = new EmbedBuilder().setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.PROCESSING }).setTitle("Please Wait...").setColor(0xf18701).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    if (embed.channelId === process.env.BOT_CHANNEL) {
      con.getConnection(async function (err, depfunc) {
        if (!err) {
          if (embed.options.get("amount").value <= 0) {
            deposit.setTitle("Amount should be greater than 0").setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setColor(0xff0000);
            await embed.followUp({ embeds: [deposit] });
          } else {
            depfunc.query(`select mdu_bal, wallet_name from Faucet where userid = ${userid}`, async function (err, result) {
                const dep = embed.options.get("amount").value;
                const recip = result[0].wallet_name;
                const bal = result[0].mdu_bal;
                const send = dep / 100;
                if (recip != null) {
                  if (!err) {
                    if (bal >= dep) {
                      const url = `http://server.duinocoin.com/transaction/?username=` + encodeURIComponent(process.env.MASTER_USER) + `&password=` + encodeURIComponent(process.env.MASTER_KEY) + `&recipient=` + encodeURIComponent(recip) + `&amount=` + encodeURIComponent(send) + `&memo=HashCraft Faucet https://discord.gg/vH8fxYZcr8`;
                      http.get(url, (res) => {
                        let data = "";
                        res.on("data", (chunk) => {
                          data += chunk;
                        });
                        res.on("end", async () => {
                          const json = JSON.parse(data);
                          console.log(data);
                          if (json.success) {
                            const txid = String(json.result).split(",")[2];
                            deposit.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.SUCCESS }).setTitle("Deposit Successful").setColor(0x00ff00).setDescription(`Successfully converted \`⧈${dep}\` into \`${dep / 100} ↁ\` and sent to Account: ${recip}\nTxID: [${txid}](https://explorer.duinocoin.com?search=${txid})`).setTimestamp();
                            depfunc.query(`update Faucet set mdu_bal = ${bal - dep} where Faucet.userid = ${userid}; update Faucet set mdu_bal = mdu_bal + ${dep}, claims = claims + 1 where Faucet.userid = 1;`, [1,2], async function (err) {
                                if (err) {
                                  deposit.setTitle("Error: Query Failed").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setColor(0xff0000);
                                }
                              });
                          } else {
                            deposit.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle("Deposit Failed").setColor(0xff0000).setDescription(`An API Error Occured. Please try again.`).setTimestamp();
                          }
                          await embed.followUp({ embeds: [deposit] });
                        });
                      }).on("error", async (e) => {
                        deposit.setDescription("Error while fetching API Request: ```\n" +e +"\n```").setTitle("An API Error Occured. Please try again.").setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setColor(0xff0000).setTimestamp();
                        await embed.followUp({
                          embeds: [deposit],
                        });
                      });
                    }
                    else {
                      deposit.setTitle("You don't have enough mDU!").setDescription("Current balance: ⧈" + bal).setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setColor(0xff0000);
                      await embed.followUp({ embeds: [deposit] });
                    }
                  } else {
                    deposit.setTitle("Error: Query Failed").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setColor(0xff0000);
                    await embed.followUp({ embeds: [deposit] });
                  }
                } else {
                  deposit.setTitle(`Account not linked yet`).setDescription(`You haven't linked your Duino-Coin Account to this discord user. Run /link to do so.`).setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setColor(0xff0000);
                  await embed.followUp({ embeds: [deposit] });
                }
                depfunc.release();
              });
          }
        } else {
          deposit.setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL }).setTitle("Error: Unable to connect to DB.").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
          await embed.followUp({ embeds: [deposit] });
        }
      });
    } else {
      deposit.setTitle("Use the correct channel dammit").setColor(0xff0000).setDescription(`You can only use this command on <#${process.env.BOT_CHANNEL}>.`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
      await embed.followUp({ embeds: [deposit], ephemeral: true });
    }
  }
}