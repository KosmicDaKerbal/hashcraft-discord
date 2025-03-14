const process = require("process");
const dayjs = require('dayjs');
const {EmbedBuilder} = require("discord.js");
module.exports = {
  drop: async function (embed, userid, con) {
    const claimbox = new EmbedBuilder().setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.PROCESSING }).setTitle("Please Wait...").setColor(0xf18701).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
      if (embed.channelId === process.env.BOT_CHANNEL) {
      await embed.deferReply();  
    const u = userid;
    con.getConnection(async function (err, claim) {
      if (err) {
        claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle("Error: Unable to connect to DB.").setColor(0xff0000).setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.");
        await embed.followUp({ embeds: [claimbox] });
      } else {
        claim.query(`insert into Faucet (userid) values (${u}) on duplicate key update userid = ${u}`,async function (err) {
            if (!err) {
              const claimtime = dayjs();
              claim.query(`select wallet_name, streak, last_used from Faucet where userid = ${u};`,async function (err, result) {
                  if (!err) {
                    if (result[0].wallet_name == null) {
                      claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle(`Account not linked yet`).setDescription(`You haven't linked your Duino-Coin Account to this discord user. Run /link to do so.`).setColor(0xff0000);
                      await embed.followUp({ embeds: [claimbox] });
                    } else {
                      var streak = result[0].streak;
                      const use = result[0].last_used;
                      const timediff = claimtime.diff(use, 'day');
                      switch (timediff) {
                        case 0:
                          const cooldown = claimtime.add(1, 'day').set('hour', 0).set('minute', 0).set('second', 0);
                          claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle(`Don't be Greedy!`).setDescription(`You have claimed already. Try again <t:${cooldown.unix()}:R>`).setColor(0xff0000);
                          await embed.followUp({ embeds: [claimbox] });
                          break;
                        default:
                          var lost = [];
                          if (timediff == 1) {
                            streak = streak + 1;
                            lost = [0,0];
                          } else {
                            lost = [1, streak];
                            streak = 1;
                          }
                          var drop;
                          if (streak <= 25) {
                            drop = Math.round(Math.pow(1.19775, streak) + 9);
                          } else {
                            drop = Math.round((Math.log(streak)+ (45 * Math.log(1.06))) / Math.log(1.06));
                          }
                          claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.SUCCESS }).setTitle(`Claim Successful`).setDescription(`Drop: \`⧈${drop}\`\nCurrent streak: ${streak}`).setColor(0x00ff00);
                          if (lost[0] && use != null) {
                            claimbox.setDescription(`Drop: \`⧈${drop}\`\nYou lost your streak of ${lost[1]}`);
                          } else if (use == null) {
                            streak = 1;
                          }
                          claim.query(`insert into Faucet (userid, last_used, streak) values (${u}, '${claimtime.format("YYYY-MM-DD")}', ${streak}) on duplicate key update mdu_bal = mdu_bal + ${drop}, claims = claims + 1, streak = ${streak}, last_used = '${claimtime.format("YYYY-MM-DD")}';`,async function (err) {
                              if (!err) {
                                await embed.followUp({ embeds: [claimbox] });
                              } else {
                                claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle(`Error`).setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
                                await embed.followUp({ embeds: [claimbox] });
                              }
                            });
                          break;
                      }
                    }
                  } else {
                    claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle("DB Query Failed").setDescription("Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
                    await embed.followUp({ embeds: [claimbox] });
                  }
                });
            } else {
              claimbox.setAuthor({ name: `${process.env.BOT_NAME} Faucet`, iconURL: process.env.FAIL }).setTitle("DB Query Failed").setDescription("Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
              await embed.followUp({ embeds: [claimbox] });
            }
            claim.release();
          });
      }
    });
  } else {
    claimbox.setTitle("Use the correct channel dammit").setColor(0xff0000).setAuthor({ iconURL: process.env.FAIL }).setDescription(`You can only use this command on <#${process.env.BOT_CHANNEL}>.`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    await embed.reply({ embeds: [claimbox], ephemeral: true });
  }
  }
}