require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require ('discord.js');

const commands = [
{
    name: 'help',
    description: 'Complete Commands List for the Bot.',
},
{
    name: 'stats',
    description: 'Display Information about the Bot and Server',
},
{
    name: 'link',
    description: "Link your DuinoCoin Wallet to this server's exclusive faucet.",
    options: [
        {
            name: 'account-name',
            description: 'Name of your Duino-Coin Account',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
},
{
    name: 'claim',
    description: 'Get your daily ⧈ mDU',
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