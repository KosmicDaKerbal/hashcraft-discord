const process = require("process");
const { EmbedBuilder } = require("discord.js");
module.exports = {
    execute: async function (embed) {
        const purge = new EmbedBuilder().setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
        const param = embed.options.get("purge-limit").value;
            purge.setAuthor({ name: `${process.env.BOT_NAME} Administration`, iconURL: process.env.SUCCESS }).setTitle("Purged \`" + param + "\` Messages.").setColor(0x00ff00);
            try {
            await embed.channel.bulkDelete(param);
            } catch (err){
            purge.setAuthor({ name: `${process.env.BOT_NAME} Administration`, iconURL: process.env.FAIL }).setTitle("Purge Failed").setColor(0xff0000).setDescription("Error Log:\n\`\`\`\n" + err + "\n\`\`\`");
            }
            await embed.reply({ embeds: [purge] });
    }
}