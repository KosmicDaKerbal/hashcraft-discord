const process = require("process");
const { EmbedBuilder } = require("discord.js");
module.exports = {
    modify: async function (embed, con) {
    const modbal = new EmbedBuilder().setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    console.log(embed.options.get("purge-limit").value);
    embed.reply("check logs");
    }
}