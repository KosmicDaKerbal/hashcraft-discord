const {EmbedBuilder} = require("discord.js");
  const process = require("process");
  module.exports = {
    send: async function (embed) {
      const help = new EmbedBuilder().setTitle("List of Working Duinocoin Faucets").setColor(0xf18701).setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp()
      .addFields(
          {
            name: "DuinoFaucet",
            value: "[1 DUCO per 12 Hours](https://faucet.duinocoin.com/duinocoin)",
            inline: true,
          },
          {
            name: "Amogus Faucet",
            value: "[0.5 - 2 DUCO every 15 Minutes, or 5 DUCO per day](https://duco-faucet.pcgeek.pl)",
            inline: true,
          },
          {
            name: "Pastel Faucet",
            value:
              "[0.6 - 1.4 DUCO per day](https://pastelfaucet.com/index.php)",
            inline: true,
          },
          {
            name: "KatFaucet",
            value:
              "[0.01 - 5 DUCO per day](https://katfaucet.com)",
            inline: true,
          },
          {
            name: "tbwcjw Faucet",
            value:
              "[0.5 DUCO per 12 Hours](https://faucet.tbwcjw.online/)",
            inline: true,
          },
          {
            name: "Hashcraft Faucet",
            value:
              "[0.1 - 1 DUCO every day](https://discord.gg/vH8fxYZcr8)",
            inline: true,
          },
        );
      await embed.reply({ embeds: [help] });
    }
  }