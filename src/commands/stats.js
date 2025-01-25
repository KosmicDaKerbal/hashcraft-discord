const process = require("process");
const {EmbedBuilder} = require("discord.js");
function format (mb){
if (mb > 1024) {return mb/1024 + "MB"};
return mb + "kB";
}
function timeFormat (time){
  time = Math.round(time);
  if (time >= 60 && time < 3600) return `${Math.floor(time/60)} minutes and ${time % 60} seconds`;
  else if (time >= 3600) return `${Math.floor(time/3600)} hours, ${Math.floor((time % 3600)/60)} minutes and ${(time % 3600) % 60} seconds`;
  return `${time} seconds`;
  }
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
      { name: "RAM Usage", value: ram + "MB", inline: true },
      { name: "Uptime", value: timeFormat(process.uptime()), inline: true }
    );
    sql.getConnection(async function (err, constats) {
      if (err) {
        stats.setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").addFields(
          { name: "Database (Size)", value: process.env.STAT_DB + " (Error)", inline: true },
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
          select sum(mdu_bal) as circulation from Faucet where userid != 1;
          select round((DATA_LENGTH + INDEX_LENGTH) / 1024) AS size from information_schema.TABLES where table_name = 'Faucet'`, async function (err, result) {
          if (!err) {
            const users = "" + result[0][0].users;
            const fclaims = "" + result[1][0].sum;
            const fdeps = "" + result [2][0].claims;
            const fsent = "ↁ" + (result[2][0].mdu_bal / 100);
            const circ = "⧈" + result [3][0].circulation;
            const size = format(result [4][0].size);
            stats.addFields(
              { name: "Database (Size)", value: process.env.STAT_DB + ` (${size})`, inline: true },
              { name: "Linked Users", value: users, inline: true },
              { name: "Total Faucet Claims", value: fclaims, inline: true },
              { name: "Total Deposits", value: fdeps, inline: true },
              { name: "Total DUCO Sent", value: fsent, inline: true },
              { name: "Total ⧈ mDU in circulation", value: circ, inline: true }
            );
            await embed.editReply({ embeds: [stats] });
          } else {
            stats.setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").addFields(
              { name: "Database (Size)", value: process.env.STAT_DB + " (Error)", inline: true },
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