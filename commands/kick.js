const Discord = require('discord.js');
const { modChannel, footer, logo, rejoinLink, useRole } = require('../config.json');
module.exports = {
	name: 'kick',
	description: 'Kick a member',
	guildOnly: true,
	execute(message, args) {
	if(message.member.hasPermission("KICK_MEMBERS")) {
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		const user = message.mentions.users.first();
		if (args[1]) {
			const reason = args[1];
			if (user) {
				const member = message.guild.member(user);
				if (member) {
					const kickEmbedDM = new Discord.MessageEmbed()
						.setColor('#ff0000')
						.setTitle('You were kicked')
						.setURL('https://jwacre.com/appeal')
						.addField('You were kicked by', message.author, false)
						.addField('Reason', reason + `\n You can rejoin by using this link: ${rejoinLink}`, false)
						.setThumbnail('https://cdn.jwacre.com/images/JwLogo.png')
						.setTimestamp()
						.setFooter(footer, 'https://cdn.jwacre.com/images/JwLogo.png');
					member.send(kickEmbedDM).then(r => {
						console.log(`Sent a DM to ${user.tag}`)
						console.log(`${user.tag} was kicked by ${message.author.username}+'#'+${message.author.discriminator}`)
					});

					const kickEmbedLOGS = new Discord.MessageEmbed()
						.setColor('#ff0000')
						.setTitle(user.username + "#" + user.discriminator + ' was kicked.')
						.addField('They were kicked by', message.author, false)
						.addField('Reason', reason, false)
						.setThumbnail('http://cdn.jwacre.com/images/JwLogo.png')
						.setTimestamp()
						.setFooter(footer, 'http://cdn.jwacre.com/images/JwLogo.png');
					message.guild.channels.cache.get(modChannel).send(kickEmbedLOGS);

					sleep(2000);
					member
						.kick(reason)
						.then(() => {
							message.reply(`:white_check_mark: **Successfully kicked** ${user.tag}`);
						})
						.catch(err => {
							message.reply(':no_entry: I was unable to kick the member');
							console.error(err);
						});
				} else {
					message.channel.send(":no_entry: That user isn't in this guild!");
				}
			} else {
				message.channel.send(":no_entry: You didn't mention the user to kick!");
			}

		} else {
			message.channel.send(':no_entry: You didn\'t inclue a reason!');
		}
	}else{
		message.guild.channels.cache.get(modChannel).send(`${message.author} tried to use an admin command without sufficient permissions!`);
		message.channel.send(":no_entry: You do not have the right permissions!")
	}
	},
};