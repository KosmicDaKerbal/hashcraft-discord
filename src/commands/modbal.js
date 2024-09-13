const process = require("process");
const { EmbedBuilder } = require("discord.js");
module.exports = {
    modify: async function (embed, con) {
    const modbal = new EmbedBuilder().setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    console.log(embed.options.get("user-to-modify").value);
    console.log(embed.options.get("new-balance").value);
    embed.reply("check logs");
    }
}