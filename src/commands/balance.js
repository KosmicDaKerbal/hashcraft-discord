const {EmbedBuilder} = require("discord.js");
const process = require("process");

module.exports = {
  check: async function (embed, uid, con) {
    await embed.deferReply();
    const bal = new EmbedBuilder().setTitle("User mDU Balance").setDescription("Please Wait...").setColor(0xf18701).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.PROCESSING }).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}` });
    var userid;
    if (embed.options.get("of-user") == null){
      userid = uid;
      bal.setDescription(`You haven't linked your Duino-Coin Account to this discord user. Run /link to do so.`);
    } else {
      userid = embed.options.get("of-user").value;
      bal.setDescription(`This user has not linked their Duino-Coin Account.`);
    }
    if (embed.channelId === process.env.BOT_CHANNEL) {
    con.getConnection(async function (err, balance) {
      if (err) {
        bal.setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL }).setTitle("Error: Unable to connect to DB.").setDescription("Log: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000);
        await embed.followUp({ embeds: [bal] });
      } else {
        balance.query(`insert into Faucet (userid) values (${userid}) on duplicate key update userid = ${userid}`, async function (err) {
            if (!err) {
              balance.query(`select wallet_name, mdu_bal from Faucet where userid = ${userid}`, async function (err, result) {
                  if (!err) {
                    if (result[0].wallet_name == null) {
                      bal.setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL }).setTitle(`Account not linked yet`).setColor(0xff0000);
                      await embed.followUp({ embeds: [bal] });
                    } else {
                      const balc = result[0].mdu_bal;
                      bal.setDescription(`<@${userid}>'s Current Balance: \`⧈${balc}\`\nDUCO Balance:\`ↁ ${balc / 100}\``).setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.ICON });
                      await embed.followUp({ embeds: [bal] });
                    }
                  } else {
                    bal.setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL });
                    await embed.followUp({ embeds: [bal] });
                  }
                });
            } else {
              bal.setDescription("DB Query Failed, Error Message: \n\`\`\`\n" + err + "\n\`\`\`\nPlease try again.").setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL });
              await embed.followUp({ embeds: [bal] });
            }
            balance.release();
          });
      }
    });
  } else {
      bal.setTitle("Use the correct channel dammit").setColor(0xff0000).setDescription(`You can only use this command on <#${process.env.BOT_CHANNEL}>.`).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}`, iconURL: process.env.ICON }).setTimestamp();
      await embed.followUp({ embeds: [bal], ephemeral: true });
    }
  }
}