require('dotenv').config();
const ver = 0.3;
const ico = "https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png";
const {Client, IntentsBitField, InteractionCollector, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require ('discord.js');
const http = require('http');
const process = require('process');
var exec = require("child_process").exec;
var cpu = 0;
const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
function getProcessPercent() {
    const pid = process.pid;
    var cmd = `ps up "${pid}" | tail -n1 | tr -s ' ' | cut -f3 -d' '`;
    setInterval(() => {
      exec(cmd, function (err, percentValue) {
        if (err) {
          console.log("Command `ps` returned an error!");
          return "Error";
        } else {
          console.log(`${percentValue* 1}%`);
          cpu = `${percentValue* 1}%`;
          return cpu;
        }
      });
    }, 1000);
  }

client.on('interactionCreate', async (interact) => {    
    if (!interact.isChatInputCommand()) return;
    switch (interact.commandName){
        case 'help':
            const help = new EmbedBuilder()
                .setTitle("Help Section")
                .setColor (0xF18701)
                .addFields(
                    { name: '/help', value: 'Complete Commands List for the Bot.' , inline: true },
                    { name: '/stats', value: 'Display Information about the Bot and Server', inline: true },
                    { name: '/faucet', value: "Link your DuinoCoin Wallet to this server's exclusive faucet.", inline: true },
                )
                .setFooter({text:("Duino-Coin Ecosystem v" + ver), iconURL: ico})
                .setTimestamp();
        await interact.reply({embeds: [help]});
            break;
        case 'stats':
            var ram = 0;
            for (const [key,value] of Object.entries(process.memoryUsage())){ 
                ram = ram + (value/1000000);
            }
            ram = Math.round(ram);
            const stats = new EmbedBuilder()
                .setTitle("Help Section")
                .setColor (0xF18701)
                .addFields(
                    { name: 'Host', value: 'AlwaysData' , inline: true },
                    { name: 'RAM Usage', value: ram + 'MB', inline: true },
                    { name: 'CPU Usage', value: 'foo', inline: true },
                )
                .setFooter({text:("Duino-Coin Ecosystem v" + ver), iconURL: ico})
                .setTimestamp();
        await interact.reply({embeds: [help]});
            break;
        case 'faucet':
            const confirmbox = new EmbedBuilder()
                .setTitle("Link Account to User")
                .setDescription("Please Wait...")
                .setColor (0xFF0000)
                .setFooter({text:("Duino-Coin Ecosystem v" + ver), iconURL: ico})
                .setTimestamp();
        await interact.reply({embeds: [confirmbox]});
        
        http.get('http://server.duinocoin.com/v2/users/' + interact.options.get('account-name').value, (res) => {
        let data = '';
        res.on ('data', (chunk) =>  {
        data += chunk;
        });
        res.on('end', async () => {
            //console.log(data);
            const json = JSON.parse(data);
            const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Success)
            .setDisabled(false);

		    const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger)
            .setDisabled(false);
            const choice = new ActionRowBuilder()
			    .addComponents(cancel, confirm);
            if (json.success){
                confirmbox.setDescription("Confirm Account Link: " + String(interact.options.get('account-name').value)).setColor (0xFFFF00).setTimestamp();
                const rep = await interact.editReply({embeds: [confirmbox], components: [choice]});
                const filter = (i) => i.user.id === interact.user.id;
                const collector = rep.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter,
                    time: 10_000,
                });
                collector.on('collect', async (inter) => {
                    switch (inter.customId){
                        case 'confirm':
                            confirmbox.setTitle("Linked Account " + String(interact.options.get('account-name').value) + " Successfully.").setDescription('Run /claim to get your daily DUCO').setColor (0x00FF00).setTimestamp();
                            cancel.setStyle(ButtonStyle.Secondary);
                            break;
                        case 'cancel':
                            confirmbox.setTitle("Cancelled Linking Account " + String(interact.options.get('account-name').value)).setDescription('Try Again?').setColor (0xFF0000).setTimestamp();
                            confirm.setStyle(ButtonStyle.Secondary);
                            break;
                    }
                    confirm.setDisabled(true);
                    cancel.setDisabled(true);
                    await interact.editReply({components: [choice]});
                    await inter.reply({embeds: [confirmbox]});
                });
            } else {
                confirmbox.setDescription("Error: " + String(json.message)).setColor (0xFF0000).setTimestamp();
                confirm.setDisabled(true);
                cancel.setDisabled(true);
                await interact.editReply({embeds: [confirmbox]});
            }
        });
    })
    .on('error', (e) => {
        console.log (e);
    })
            break;    
    }
});

console.log ('Connecting...');
client.on('ready', (c)=>{
console.log ('Welcome to the DuinoCoin Ecosystem.');
})
client.login(process.env.TOKEN);