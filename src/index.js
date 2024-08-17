require('dotenv').config();
const {Client, IntentsBitField, InteractionCollector} = require ('discord.js');
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
        await interact.reply("Please Wait...");
        http.get('http://server.duinocoin.com/v2/users/' + interact.options.get('account-name').value, (res) => {
        let data = '';
        res.on ('data', (chunk) =>  {
        data += chunk;
        });
        res.on('end', async () => {
            console.log(data);
            const json = JSON.parse(data);
            if (json.success){
                await interact.editReply("Confirm Account Link: " + String(interact.options.get('account-name').value));
            } else {
                await interact.editReply("Error: " + String(json.message));
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