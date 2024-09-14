const process = require("process");
const { EmbedBuilder } = require("discord.js");
module.exports = {
    modify: async function (embed, con) {
    const modbal = new EmbedBuilder().setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    const uid = embed.options.get("user-to-modify").value;
    const nbal = embed.options.get("new-balance").value;
    await embed.deferReply();
    }
}
