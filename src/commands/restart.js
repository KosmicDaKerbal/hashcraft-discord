const process = require("process");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const dayjs = require('dayjs');
module.exports = {
    execute: async function (embed) {
        const restart = new EmbedBuilder().setTitle("Confirm Bot Restart").setColor(0xf18701).setAuthor({ name: `${process.env.BOT_NAME} Administration`, iconURL: process.env.PROCESSING }).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
        const restartConfirm = new ButtonBuilder().setCustomId("reconfirm").setLabel("Restart").setStyle(ButtonStyle.Danger).setDisabled(false);
        const component = new ActionRowBuilder().addComponents(restartConfirm);
        const filter = (i) => i.user.id === embed.user.id;
        const purgereply = await embed.reply({ embeds: [restart], components: [component] });
        const collect = purgereply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter,
            time: 15_000,
          });
        collect.on("collect", async (rstInteraction) => {
            if (rstInteraction.customId == 'reconfirm'){
                restartConfirm.setDisabled(true).setStyle(ButtonStyle.Success);
                await embed.editReply({ embeds: [restart], components: [component], });
            const rstime = dayjs();
            restart.setAuthor({ name: `${process.env.BOT_NAME} Administration`, iconURL: process.env.SUCCESS }).setColor(0x00ff00).setTitle("Restarting...").setDescription(`Bot restarts <t:${rstime.unix() + 15}:R> from now.`).setTimestamp();
            await rstInteraction.reply({ embeds: [restart] });
            return 1;
            }
        });
        collect.on("end", async () => {
            restartConfirm.setDisabled(true);
            await embed.editReply({components: [component],});
        });
        return 0;
    }
}