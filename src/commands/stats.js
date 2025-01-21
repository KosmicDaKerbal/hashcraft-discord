const process = require("process");
const {EmbedBuilder} = require("discord.js");
module.exports = {
  send: async function (embed, sql) {
    var ram = 0;
    const mem = process.memoryUsage();
    ram = mem.rss/1048576;
    ram = Math.round(ram);
    await embed.deferReply();
    const stats = new EmbedBuilder().setTitle("Bot Statistics").setColor(0xf18701).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp().setImage(process.env.SERVER)
    .addFields(
      { name: "Host", value: process.env.STAT_SERVER, inline: true },
      { name: "Database", value: process.env.STAT_DB, inline: true },
      { name: "RAM Usage", value: ram + "MB", inline: true }
    );
    sql.getConnection(async function (err, constats) {
      if (err) {
        stats.setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").addFields(
          { name: "Registered Users", value: "Error", inline: true },
          { name: "Total Faucet Claims", value: "Error", inline: true },
          { name: "Total Deposits", value: "Error", inline: true },
          { name: "Total DUCO Sent", value: "Error", inline: true },
          { name: "Total ⧈ mDU in circulation", value: "Error", inline: true }
        );
        await embed.editReply({ embeds: [stats] });
      } else {
        constats.query(`select count (*) - 1 as users from Faucet where wallet_name is not null; 
          select sum(claims) as sum from Faucet where userid != 1; 
          select mdu_bal, claims from Faucet where userid = 1;
          select sum(mdu_bal) as circulation from Faucet where userid != 1;`, async function (err, result) {
          if (!err) {
            const users = "" + result[0][0].users;
            const fclaims = "" + result[1][0].sum;
            const fdeps = "" + result [2][0].claims;
            const fsent = "" + (result[2][0].mdu_bal / 100);
            const circ = "" + result [3][0].circulation;
            stats.addFields(
              { name: "Linked Users", value: users, inline: true },
              { name: "Total Faucet Claims", value: fclaims, inline: true },
              { name: "Total Deposits", value: fdeps, inline: true },
              { name: "Total DUCO Sent", value: fsent, inline: true },
              { name: "Total ⧈ mDU in circulation", value: circ, inline: true }
            );
            await embed.editReply({ embeds: [stats] });
          } else {
            stats.setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").addFields(
              { name: "Registered Users", value: "Error", inline: true },
              { name: "Total Faucet Claims", value: "Error", inline: true },
              { name: "Total Deposits", value: "Error", inline: true },
              { name: "Total DUCO Sent", value: "Error", inline: true },
              { name: "Total ⧈ mDU in circulation", value: "Error", inline: true }
            );
            await embed.editReply({ embeds: [stats] });
          }
          });
      }
      constats.release();
    });
  }
}