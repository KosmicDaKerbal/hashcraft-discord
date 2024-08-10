(async () => {
    // default imports
    const events = require('events');
    const {
        exec
    } = require("child_process")
    const logs = require("discord-logs")
    const Discord = require("discord.js")
    const {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js")
    const fs = require('fs');
    let process = require('process');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // block imports
    const os = require("os-utils");
    let URL = require('url')
    let https = require("https")

    // define s4d components (pretty sure 90% of these arnt even used/required)
    let s4d = {
        Discord,
        fire: null,
        joiningMember: null,
        reply: null,
        player: null,
        manager: null,
        Inviter: null,
        message: null,
        notifer: null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // check if d.js is v13
    if (!require('./package.json').dependencies['discord.js'].startsWith("^13.")) {
        let file = JSON.parse(fs.readFileSync('package.json'))
        file.dependencies['discord.js'] = '^13.16.0'
        fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
        exec('npm i')
        throw new Error("Seems you arent using v13 please re-run or run `npm i discord.js@13.16.0`");
    }

    // check if discord-logs is v2
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
        let file = JSON.parse(fs.readFileSync('package.json'))
        file.dependencies['discord-logs'] = '^2.0.0'
        fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
        exec('npm i')
        throw new Error("discord-logs must be 2.0.0. please re-run or if that fails run `npm i discord-logs@2.0.0` then re-run");
    }

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION",
            "CHANNEL"
        ]
    });

    // when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // upon error print "Error!" and the error
    process.on('uncaughtException', function(err) {
        console.log('Error!');
        console.log(err);
    });

    // give the new client to discord-logs
    logs(s4d.client);

    // pre blockly code


    // blockly code
    s4d.client.on('ready', async () => {
        s4d.client.user.setActivity('The DuinoCoin Ecosystem', {
            type: "STREAMING",
            url: 'https://duinocoin.com'
        });

    });

    const http = require('http');
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Bot is Alive!');
    });
    server.listen(3000);

    await s4d.client.login('MTI2Nzg1NTEzNzk5Nzg0ODY4Ng.GxcyMX.3QotDascLl8IDFcrfMnqQoLtXX-VHlUOwmWbLc').catch((e) => {
        const tokenInvalid = true;
        const tokenError = e;
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("An invalid bot token was provided!")
        } else {
            throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
        }
    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (s4dmessage.author.bot) {
            return;
        }
        if ((s4dmessage.content) == '!ping') {
            s4dmessage.channel.send({
                content: String('pong!')
            });
        } else if ((s4dmessage.content) == '!help') {
            var Help = new Discord.MessageEmbed();
            Help.setColor('#ff6600');
            Help.setAuthor(String(((s4d.client.user).username)), String(), String());
            Help.setTitle(String('Help Section'))
            Help.setURL(String());
            Help.setDescription(String('Complete Commands List for the Duino-Coin Ecosystem Bot'));
            Help.setThumbnail(String('https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png'));
            Help.setTimestamp(new Date());
            Help.addField(String('!ping'), String('Pings the bot and it responds as fast as possible.'), true);
            Help.addField(String('!help'), String('Lists Server Commands'), true);
            Help.addField(String('!info'), String('Show Bot System Info'), true);
            Help.addField(String('!donate'), String('Show your support to the project!'), true);
            Help.setFooter({
                text: String('The Duino-Coin Ecosystem v0.1'),
                iconURL: String('https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png')
            });

            s4dmessage.channel.send({
                embeds: [Help]
            });
        } else if ((s4dmessage.content) == '!info') {
            var Info = new Discord.MessageEmbed();
            Info.setColor('#ff6600');
            Info.setAuthor(String(((s4d.client.user).username)), String(), String());
            Info.setTitle(String('Bot Information'))
            Info.setURL(String());
            Info.setDescription(String('Host Specifications'));
            Info.setThumbnail(String('https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png'));
            Info.setTimestamp(new Date());
            Info.addField(String('Created by:'), String('KosmicDaKerbal'), true);
            Info.addField(String('Bot Host:'), String('render.com'), true);
            Info.addField(String('Bot CPU Usage:'), String((obj)), true);
            Info.setFooter({
                text: String('The Duino-Coin Ecosystem v0.1'),
                iconURL: String('https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png')
            });

            s4dmessage.channel.send({
                embeds: [Info]
            });
        } else if ((s4dmessage.content) == '!donate') {
            var Donate = new Discord.MessageEmbed();
            Donate.setColor('#ff6600');
            Donate.setAuthor(String('KosmicDaKerbal'), String(), String());
            Donate.setTitle(String('Donate to the project'))
            Donate.setURL(String());
            Donate.setDescription(String('Your support to the project can go a long way. Even a small donation of 10 DUCO, or 1 BAN means a lot to me. Thank you.'));
            Donate.setThumbnail(String('https://i.postimg.cc/VkmXJRRd/Jeb-Having-Fun-2.png'));
            Donate.setTimestamp(new Date());
            Donate.addField(String('DuinoCoin Wallet:'), String('KosmicDaKerbal'), false);
            Donate.addField(String('Banano Wallet:'), String('ban_137xmpo7eqis7oymw9ob9b5qparzqc799jxw8o3udzm3p6rrtgj83wczwo7a'), false);
            Donate.setFooter({
                text: String('The Duino-Coin Ecosystem v0.1'),
                iconURL: String('https://i.postimg.cc/zGx8nznT/Duinocoin-Ecosystem.png')
            });

            s4dmessage.channel.send({
                embeds: [Donate]
            });
        }

    });

    return s4d
})();
