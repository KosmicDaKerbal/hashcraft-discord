require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require ('discord.js');

const commands = [
{
    name: 'help',
    description: 'Lists all Commands of the Bot.',
},
{
    name: 'stats',
    description: 'Show Bot System Info.',
},
{
    name: 'faucet',
    description: 'Link Duino-Coin Wallet to this Discord User.',
    options: [
        {
            name: 'account-name',
            description: 'Name of your Duino-Coin Account',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
},
];
const rest = new REST({version:'10'}).setToken(process.env.TOKEN);
(async() => {
    try {
        console.log ('Registering Slash Commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body:commands}
        );
        console.log('Slash Commands Registration Successful.');
    } catch (error){
        console.log(`Error: ${error}`);
    }
})();