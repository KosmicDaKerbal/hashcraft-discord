require('dotenv').config();
const ver = 0.3;
const ico = "https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png";
const {Client, IntentsBitField, InteractionCollector, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require ('discord.js');
const http = require('http');
const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});


client.on('interactionCreate', async (interact) => {
    if (!interact.isChatInputCommand()) return;
    switch (interact.commandName){
        case 'help':
            break;
        case 'stats':
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
            console.log(data);
            const json = JSON.parse(data);
            const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Success);

		    const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger);
            if (json.success){
                confirmbox.setDescription("Confirm Account Link: " + String(interact.options.get('account-name').value)).setColor (0xFFFF00).setTimestamp();
                const choice = new ActionRowBuilder()
			    .addComponents(cancel, confirm);
                await interact.editReply({embeds: [confirmbox], components: [choice]});
            } else {
                confirmbox.setDescription("Error: " + String(json.message)).setColor (0xFF0000).setTimestamp();
                await interact.editReply({embeds: [confirmbox]});
            }
        });
    })
    .on('error', (e) => {
        console.log (e);
    })
            break;    
    }
    if (!interact.isButton) return;
    await interact.deferReply({ephemeral: true});
});
console.log ('Connecting...');
client.on('ready', (c)=>{
console.log ('Welcome to the DuinoCoin Ecosystem.');
})
client.login(process.env.TOKEN);