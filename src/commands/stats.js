const process = require("process");
const {
    EmbedBuilder,
  } = require("discord.js");
module.exports = {
send: async function (embed){
    var ram = 0;
      for (const [key, value] of Object.entries(process.memoryUsage())) {
        ram = ram + value / 1000000;
      }
      ram = Math.round(ram);
      const stats = new EmbedBuilder()
        .setTitle("Bot Statistics")
        .setColor(0xf18701)
        .addFields(
          { name: "Host", value: "Server Inspiron", inline: true },
          { name: "Database", value: "AlwaysData MySQL", inline: true },
          { name: "RAM Usage", value: ram + "MB", inline: true }
        )
        .setFooter({ text: "HashCraft v" + process.env.BOT_VERSION, iconURL: process.env.ICON })
        .setTimestamp();
      await embed.reply({ embeds: [stats] });
}
}