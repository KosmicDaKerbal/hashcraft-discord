require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

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
    {
        name: 'deposit',
        description: "Convert your ⧈ mDU into DUCO and transfer it to your account",
        options: [
            {
                name: 'amount',
                description: 'Amount to deposit',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ],
    },
    {
        name: 'balance',
        description: 'Shows your ⧈ mDU balance',
        options: [
            {
                name: 'of-user',
                description: 'The Username whose balance to view.',
                type: ApplicationCommandOptionType.User,
                required: false,
            },
        ]
    },
    {
        name: 'slowmode',
        description: "Set a Slowmode: Admin Command",
        options: [
            {
                name: 'duration',
                description: 'Time in Seconds',
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 1,
                max_value: 360,
            },
        ],
    },
    {
        name: 'purge',
        description: "Purges Past Messages: Admin Command",
        options: [
            {
                name: 'purge-limit',
                description: 'Number of Messages',
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 1,
                max_value: 100,
            },
        ],
    },
    {
        name: 'restart',
        description: 'Restarts the Bot: Admin Command',
    },
    {
        name: 'modbal',
        description: "Modifies the ⧈ mDU Balance of a user: Admin Command",
        options: [
            {
                name: 'user-to-modify',
                description: 'The Username whose account is to be modified.',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'new-balance',
                description: 'The balance to set for the user',
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 0,
                max_value: 1000000,
            },
        ],
    },
    {
        name: 'pay',
        description: "Pay a user in ⧈ mDU",
        options: [
            {
                name: 'mdu-recipient',
                description: 'The user to send ⧈ mDU',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'mdu-amount',
                description: 'Amount to pay',
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 0,
                max_value: 1000000,
            },
        ],
    },
];
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('Registering Slash Commands...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Slash Commands Registration Successful.');
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();