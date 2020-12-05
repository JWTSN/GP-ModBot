const Discord = require('discord.js');
const { modChannel, footer } = require('../config.json');
module.exports = {
    name: 'ban',
    description: 'Ban a member',
    guildOnly: true,
    async execute(message, args) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        if (message.channel.type === 'dm') {
            message.channel.send('That command has been disabled in DMs!')
        }
        return;

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            message.guild.channels.cache.get(modChannel).send(`${message.author} tried to use an admin command without sufficient permissions!`);
            message.channel.send(":no_entry: You do not have the right permissions!");
            return;
        }


        const user = message.mentions.users.first();
        if (args[1]) {
            const reason = args[1];
            if (user) {
                const member = message.guild.member(user);
                if (member) {

                    const banEmbedDM = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle('You were banned.')
                        .setURL('https://jwacre.com/appeal')
                        .addField('You were banned by', message.author.username + '#' + message.author.discriminator, false)
                        .addField('Reason', reason, true)
                        .addField('Length', 'Permanent', true)
                        .addField('Appeals', 'If you would like to appeal a punishment, go to the link below or click on the title of this message: \n www.JwAcre.com/Appeal', false)
                        .setThumbnail('http://cdn.jwacre.com/images/JwLogo.png')
                        .setTimestamp()
                        .setFooter(footer, 'http://cdn.jwacre.com/images/JwLogo.png');
                    member.send(banEmbedDM).then(r => {
                        console.log(`Sent a DM to ${user.tag}`)
                        console.log(`${user.tag} was banned by ${message.author.username}+'#'+${message.author.discriminator}`)
                    });
                    try {
                        await member.send(banEmbedDM).then(r => {
                            console.log(`Sent a DM to ${user.tag}`)
                            console.log(`${user.tag} was kicked by ${message.author.username}#${message.author.discriminator}`)
                        });
                    } catch (err) {
                        console.log('An error prevented that user from being sent a rejoin message. It is possible that the user has turned off direct messaging in the server of has blocked the bot. If you would like to send the user a rejoin link, please message them manually.');
                    }
                    const banEmbedLOGS = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle(user.username + "#" + user.discriminator + ' was banned.')
                        .setURL('https://jwacre.com/appeal')
                        .addField('They were banned by', message.author, false)
                        .addField('Reason', reason, true)
                        .addField('Length', 'Permanent', true)
                        .addField('Appeals', 'If you would like to appeal a punishment, go to the link below or click on the title of this message: \n www.JwAcre.com/Appeal', false)
                        .setThumbnail('http://cdn.jwacre.com/images/JwLogo.png')
                        .setTimestamp()
                        .setFooter(footer, 'http://cdn.jwacre.com/images/JwLogo.png');
                    message.guild.channels.cache.get(modChannel).send(banEmbedLOGS);
                    sleep(1000);

                    member
                        .ban({days: 7, reason: reason})
                        .then(() => {
                            message.reply(`:white_check_mark: **Successfully banned** ${user.tag}`);
                        })
                        .catch(err => {
                            message.reply(':no_entry: I was unable to ban the member');
                            console.error(err);
                        });
                } else {
                    message.reply(":no_entry: That user isn't in this server!");
                }
            } else {
                message.reply(":no_entry: You didn't mention the user to ban!");
            }

        } else {
            message.reply(':no_entry: You didn\'t inclue a reason!');
        }

    },
};
