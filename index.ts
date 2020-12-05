const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, modChannel } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();


//COMMAND FILES

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded command ${file}`);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log(`logged in as ${client.user.tag}`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.on('guildMemberAdd', member => {
    console.log(`member`);
    /*member.guild.channels.get('channelID').send("Welcome");
    const joinEmbedLOGS = new Discord.MessageEmbed()
        .setColor('#37ff00')
        .setTitle(`${member} has joined`)
        .setURL('https://jwacre.com/')
        .addField('User joined!', `${member} has joined`, false)
        .setThumbnail('http://cdn.jwacre.com/images/JwLogo.png')
        .setTimestamp()
        .setFooter(footer, 'http://cdn.jwacre.com/images/JwLogo.png');
    member.guild.channels.cache.get(modChannel).send(joinEmbedLOGS);*/
});

client.login(token);