const {
  EmbedBuilder,
} = require("discord.js");
const process = require("process");
module.exports = {
  check: async function (embed, userid, con) {
    await embed.deferReply();
    const bal = new EmbedBuilder().setTitle("mDU Balance").setDescription("Please Wait...").setColor(0xf18701).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.PROCESSING }).setFooter({ text: `${process.env.BOT_NAME} v${process.env.BOT_VERSION}` });
    con.getConnection(async function (err) {
      if (err) {
        bal.setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL })
          .setTitle("Error: Unable to connect to DB.").setDescription("Please try again.").setColor(0xff0000);
        await embed.followUp({ embeds: [bal] });
        console.log(err);
      } else {
        //await embed.followUp({ embeds: [bal] });
        con.query(
          `insert into Faucet (userid) values (${userid}) on duplicate key update userid = ${userid}`,
          async function (err) {
            if (!err) {
              con.query(
                `select wallet_name, mdu_bal from Faucet where userid = ${userid}`,
                async function (err, result) {
                  if (!err) {
                    if (result[0].wallet_name == null) {
                      bal.setAuthor(
                        { name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL }
                      ).setTitle(`Account not linked yet`).setDescription(`You haven't linked your Duino-Coin Account to this discord user. Run /link to do so.`).setColor(0xff0000);
                      await embed.followUp({ embeds: [bal] });
                    } else {
                      const balc = result[0].mdu_bal;
                      bal.setDescription(`Current Balance: ⧈${balc}\nRun /deposit to transfer ⧈ mDU to DUCO!`).setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.ICON });
                      await embed.followUp({ embeds: [bal] });
                    }
                  } else {
                    bal.setDescription("DB Query Failed, Please try again.").setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL });
                    await embed.followUp({ embeds: [bal] });
                  }
                });
            } else {
              bal.setDescription("DB Query Failed, Please try again.").setColor(0xff0000).setTimestamp().setAuthor({ name: process.env.BOT_NAME + ' Faucet', iconURL: process.env.FAIL });
              await embed.followUp({ embeds: [bal] });
            }
          });
      }
    });
  }
}