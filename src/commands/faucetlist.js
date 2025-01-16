const {EmbedBuilder} = require("discord.js");
  const process = require("process");
  module.exports = {
    send: async function (embed) {
      const help = new EmbedBuilder()
        .setTitle("List of Working Duinocoin Faucets")
        .setColor(0xf18701)
        .addFields(
          {
            name: "(DuinoFaucet)[https://faucet.duinocoin.com/duinocoin]",
            value: "1 DUCO per 12 Hours",
            inline: true,
          },
          {
            name: "[Amogus Faucet](https://duco-faucet.pcgeek.pl)",
            value: "0.5 - 2 DUCO every 15 Minutes, or 5 DUCO per day",
            inline: true,
          },
          {
            name: "[Pastel Faucet](https://pastelfaucet.com/index.php)",
            value:
              "0.6 - 1.4 DUCO per day",
            inline: true,
          },
          {
            name: "[KatFaucet](https://katfaucet.com)",
            value:
              "0.01 - 5 DUCO per day",
            inline: true,
          },
          {
            name: "[tbwcjw Faucet](https://faucet.tbwcjw.online/)",
            value:
              "0.5 DUCO per 12 Hours",
            inline: true,
          },
          {
            name: "[Hashcraft Faucet](https://discord.gg/vH8fxYZcr8)",
            value:
              "0.1 - 1 DUCO every day",
            inline: true,
          },
        )
        .setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON })
        .setTimestamp();
      await embed.reply({ embeds: [help] });
    }
  }