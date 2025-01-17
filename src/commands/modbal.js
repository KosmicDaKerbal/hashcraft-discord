const process = require("process");
const { EmbedBuilder } = require("discord.js");
module.exports = {
    modify: async function (embed, con) {
    const modbal = new EmbedBuilder().setFooter({ text: `v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
    const uid = embed.options.get("user-to-modify").value;
    const nbal = embed.options.get("new-balance").value;
    await embed.deferReply();
    con.getConnection(async function (err, conmodbal) {
        if (err) {
          modbal.setAuthor({ name: process.env.BOT_NAME + ' Administration', iconURL: process.env.FAIL }).setTitle("Error: Unable to connect to DB.").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
          await embed.followUp({ embeds: [modbal] });
        } else {
          conmodbal.query(`update Faucet set mdu_bal = ${nbal} where Faucet.userid = ${uid}`, async function (err) {
              if (!err) {
                modbal.setAuthor({ name: process.env.BOT_NAME + ' Administration', iconURL: process.env.SUCCESS }).setTitle(`Balance Changed`).setDescription(`Set <@${uid}>'s ⧈ mDU Balance to ⧈${nbal}`).setColor(0x00ff00);
          await embed.followUp({ embeds: [modbal] });
              } else {
                modbal.setAuthor({ name: process.env.BOT_NAME + ' Administration', iconURL: process.env.FAIL }).setTitle("Error: Query Failed.").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
          await embed.followUp({ embeds: [modbal] });
              }
            });
    }
    conmodbal.release();
    });
    }
}