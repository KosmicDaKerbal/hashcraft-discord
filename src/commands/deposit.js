const {
    Client,
    IntentsBitField,
    EmbedBuilder,
    ActivityType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
  } = require("discord.js");
const process = require("process");
const https = require ("https");
module.exports = {
 transfer: async function (embed, userid, con){
 const deposit = new EmbedBuilder()
    .setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.PROCESSING })
    .setTitle("Please Wait...")
    .setColor(0xf18701)
    .setFooter({ text: "HashCraft v" + process.env.BOT_VERSION, iconURL: process.env.ICON })
    .setTimestamp();
    con.getConnection(async function (err) {
        if (!err) {
          if (embed.options.get("amount").value <= 0){
            deposit.setTitle("Amount should be greater than 0").setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL }).setColor(0xff0000);
            await embed.reply({ embeds: [deposit] });
          } else {
            await embed.reply({ embeds: [deposit] });
            con.query(
              `select mdu_bal, wallet_name from Faucet where userid = ${userid}`,
              async function (err, result) {
                const dep = embed.options.get("amount").value;
                const recip = result[0].wallet_name;
                const bal = result[0].mdu_bal;
                if (!err) {
                  if (bal >= dep){
                    con.query(
                      `update Faucet set mdu_bal = ${bal-dep} where Faucet.userid = ${userid}`,
                      async function (err) {
                        if (!err){
                          https.get("https://server.duinocoin.com/transaction?username=".concat(process.env.MASTER_USER).concat("&password=").concat(process.env.MASTER_KEY).concat("&recipient=").concat(recip).concat("&amount=").concat(dep).concat("&memo=HashCraft_Faucet"),(res) => {
                            let data = "";
                            res.on("data", (chunk) => {
                              data += chunk;
                            });
                            res.on("end", async () => {
                              console.log(data);
                            const json = JSON.parse(data);
                              if (json.success){
                                deposit.setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.SUCCESS })
                                .setTitle("Deposit Successful")
                                .setColor(0x00ff00)
                                .setDescription(`Successfully transferred ⧈${dep} into ${dep/100} and sent to ${recip}`)
                                .setTimestamp();
                              } else {
                                deposit.setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL })
                                .setTitle("Deposit Failed")
                                .setColor(0xff0000)
                                .setDescription(`An API Error Occured. Please try again.`)
                                .setTimestamp();
                              }
                              await embed.editReply({ embeds: [deposit] });
                             });
                           }).on("error", async (e) => {
                            deposit
                              .setDescription(
                                "Error while fetching API Request: ```\n" +
                                e +
                                "\n```"
                              )
                              .setTitle("Amount should be greater than 0")
                              .setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL })
                              .setColor(0xff0000)
                              .setTimestamp();
                            await embed.editReply({
                              embeds: [deposit],
                            });
                          });
                        } else {
                        deposit.setTitle("Error: Query Failed").setDescription("Please try again.").setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL }).setColor(0xff0000);
                        await embed.editReply({ embeds: [deposit] });
                        }
                      });
                  }
                  else {
                    deposit.setTitle("You don't have enough mDU!").setDescription("Current balance: " + bal).setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL }).setColor(0xff0000);
                    await embed.editReply({ embeds: [deposit] });
                  }
                } else {
                  deposit.setTitle("Error: Query Failed").setDescription("Please try again.").setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL }).setColor(0xff0000);
                  await embed.editReply({ embeds: [deposit] });
                }
              });
          }
        } else {
          deposit.setTitle("Error: Connection to DB failed.").setDescription("Please try again.").setAuthor({ name: 'HashCraft Faucet', iconURL: process.env.FAIL }).setColor(0xff0000);
          await embed.editReply({ embeds: [deposit] });
        }
    });
 }
}