const { EmbedBuilder } = require("discord.js");
const process = require("process");
module.exports = {
    set: async function (embed) {
        const slow = new EmbedBuilder().setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
        if (embed.options.get("duration").value > 0) {
            embed.channel.setRateLimitPerUser(embed.options.get("duration").value);
            slow.setAuthor({ name: `${process.env.BOT_NAME} Administration`, iconURL: process.env.SUCCESS })
            .setTitle("Set slowmode to " + embed.options.get("duration").value + " seconds.")
            .setColor(0x00ff00);
           await embed.reply({ embeds: [slow] });
        } else {
            slow.setAuthor({ name: `${process.env.BOT_NAME} Administration`, iconURL: process.env.FAIL })
            .setTitle("Value must be greater than 0")
            .setColor(0xff0000);
            await embed.reply({ embeds: [slow] });
        }
    }
}