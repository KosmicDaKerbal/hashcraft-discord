const process = require("process");
const {EmbedBuilder} = require("discord.js");
module.exports = {
  send: async function (embed, sql) {
    var ram = 0;
    const mem = process.memoryUsage();
    ram = mem.rss/1048576;
    ram = Math.round(ram);
    await embed.deferReply();
    const stats = new EmbedBuilder().setTitle("Bot Statistics").setColor(0xf18701).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp().setImage(process.env.SERVER);
    sql.getConnection(async function (err, constats) {
      if (err) {
      } else {
        constats.query(`select count (*) - 1 as users from Faucet where wallet_name is not null;select sum(claims) as sum from Faucet;select mdu_bal from Faucet where userid = 1;`,[1, 2, 3], async function (err, result) {
          if (!err) {
            stats.addFields(
              { name: "Host", value: process.env.STAT_SERVER, inline: true },
              { name: "Database", value: process.env.STAT_DB, inline: true },
              { name: "RAM Usage", value: ram + "MB", inline: true },
              { name: "Registered Users", value: result[0].users, inline: true },
              { name: "Total Faucet Claims", value: result[1].sum, inline: true },
              { name: "Total DUCO Sent", value: (result[2].users/100), inline: true }
            )
          } else {
          }
          });
      }
      constats.release();
    });
    await embed.editReply({ embeds: [stats] });
  }
}