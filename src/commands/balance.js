const {
    EmbedBuilder,
  } = require("discord.js");
const process = require("process");
module.exports = {
    check: async function (embed, userid, con){
      await embed.deferReply();
      const bal = new EmbedBuilder().setTitle("mDU Balance").setDescription("Please Wait...").setColor(0xf18701).setTimestamp().setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.PROCESSING }).setFooter({ text: "HashCraft v" + process.env.BOT_VERSION});
      con.getConnection(async function (err) {
        if (err) {
          bal.setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL })
          .setTitle("Error: Unable to connect to DB.").setDescription("Please try again.").setColor(0xff0000);
          await embed.editReply({ embeds: [bal] });
          console.log(err);
        } else {
          await embed.editReply({ embeds: [bal] });
      con.query(
        `select mdu_bal from Faucet where userid = ${userid}`,
        async function (err, result) {
          if (!err) {
            const balc = result[0].mdu_bal;
            bal.setDescription(`Current Balance: ⧈${balc}\nRun /deposit to transfer ⧈ mDU to DUCO!`).setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.ICON });
            await embed.editReply({ embeds: [bal] });
          } else {
            bal.setDescription("DB Query Failed, Please try again.").setColor(0xff0000).setTimestamp().setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL });
          }});
        }});
    }
}