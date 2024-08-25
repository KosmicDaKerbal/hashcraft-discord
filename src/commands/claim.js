const process = require("process");
const dayjs = require('dayjs');
  const {
    EmbedBuilder,
  } = require("discord.js");
const link = require("./link");
module.exports = {
drop: async function (embed, userid, con){
    const u = userid;
    const claimbox = new EmbedBuilder()
    .setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.PROCESSING })
    .setTitle("Please Wait...")
    .setColor(0xf18701)
    .setFooter({ text: "HashCraft v" + process.env.BOT_VERSION, iconURL: process.env.ICON })
    .setTimestamp();
  con.getConnection(async function (err) {
    if (err) {
      claimbox.setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.PROCESSING })
      .setTitle("Error: Unable to connect to DB.").setColor(0xff0000);
      await embed.reply({ embeds: [claimbox] });
      console.log(err);
    } else {
      await embed.reply({ embeds: [claimbox] });
      con.query(
        `insert into Faucet (userid) values (${u}) on duplicate key update userid = ${u}`,
        async function (err, result) {
          if (!err) {
            const claimtime = dayjs();
            con.query(
              `select wallet_name, streak, last_used from Faucet where userid = ${u};`,
              async function (err, result) {
                if (!err) {
                  if (result[0].wallet_name == null) {
                    claimbox.setAuthor(
                      { name: 'HashCraft Faucet', iconURL: process.env.FAIL }
                    ).setTitle(`Account not linked yet`).setDescription(`You haven't linked your Duino-Coin Account to this discord user. Run /link to do so.`).setColor(0xff0000);
                    await embed.editReply({ embeds: [claimbox] });
                  } else {
                    var streak = result[0].streak;
                    const use = result[0].last_used;
                    const timediff = claimtime.diff(use, 'day')
                    switch (timediff) {
                      case 0:
                        claimbox.setAuthor(
                          { name: 'HashCraft Faucet', iconURL: process.env.FAIL }
                        ).setTitle(`Don't be Greedy!`).setDescription(`You have claimed already. Try again tomorrow.`).setColor(0xff0000);
                        await embed.editReply({ embeds: [claimbox] });
                        break;
                      default:
                        var lost;
                        if (timediff == 1) {
                          streak = streak + 1;
                          lost = 0;
                        } else {
                          lost = 1;
                        }
                        var drop;
                        if (streak <= 100) {
                          drop = Math.round(((streak * streak) / 111) + 10);
                        } else {
                          drop = 100;
                        }
                        claimbox.setAuthor(
                          { name: 'HashCraft Faucet', iconURL: process.env.SUCCESS }
                        ).setTitle(`Claim Successful`).setDescription(`Drop: ⧈${drop}\nCurrent streak: ${streak}`).setColor(0x00ff00);
                        if (lost && use != null) {
                          claimbox.setDescription(`Drop: ⧈${drop}\nYou lost your streak of ${streak}`);
                          streak = 1;
                        } else {
                          streak = 1;
                        }
                        con.query(
                          `insert into Faucet (userid, last_used, streak) values (${u}, '${claimtime.format("YYYY-MM-DD")}', ${streak}) on duplicate key update mdu_bal = mdu_bal + ${drop}, claims = claims + 1, streak = ${streak}, last_used = '${claimtime.format("YYYY-MM-DD")}';`,
                          async function (err, result) {
                            if (!err) {
                              await embed.editReply({ embeds: [claimbox] });
                            } else {
                              claimbox.setAuthor(
                                { name: 'HashCraft Faucet', iconURL: process.env.FAIL }
                              ).setTitle(`Error`).setDescription(`Could not process query`).setColor(0xff0000);
                              await embed.editReply({ embeds: [claimbox] });
                            }
                          });
                        break;
                    }
                  }
                } else {
                  claimbox.setAuthor(
                    { name: 'HashCraft Faucet', iconURL: process.env.FAIL }
                  ).setTitle("Error: Query Failed, Try Again.").setColor(0xff0000);
                  await embed.reply({ embeds: [claimbox] });
                  console.log(err);
                }
              });
          } else {
            claimbox.setAuthor(
              { name: 'HashCraft Faucet', iconURL: process.env.FAIL }
            ).setTitle("Error: Query Failed, Try Again.").setColor(0xff0000);
            await embed.reply({ embeds: [claimbox] });
            console.log(err);
          }
        });
    }
  });
}
}