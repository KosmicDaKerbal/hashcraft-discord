const process = require("process");
const {EmbedBuilder} = require("discord.js");
module.exports = {
  send: async function (embed) {
    var ram = 0;
    for (const [key, value] of Object.entries(process.memoryUsage())) {
      ram = ram + value / 1000000;
    }
    ram = Math.round(ram);
    const stats = new EmbedBuilder()
      .setTitle("Bot Statistics")
      .setColor(0xf18701)
      .addFields(
        { name: "Host", value: process.env.STAT_SERVER, inline: true },
        { name: "Database", value: process.env.STAT_DB, inline: true },
        { name: "RAM Usage", value: ram + "MB", inline: true }
      )
      .setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON })
      .setTimestamp()
      .setImage(process.env.SERVER);
    await embed.reply({ embeds: [stats] });
  }
}