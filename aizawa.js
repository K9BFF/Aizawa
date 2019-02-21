const Discord = require("discord.js");
const client = new Discord.Client();


// Clears the screen and prints the date before running the bot.
var sys = require('util')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }
exec("clear", puts);
exec("date", puts);

// Configs
const prefix = "."; // This can be anything, so long as there's no space in it.
const token = "" // Your bot token.
const ownerid = "" // The Server Owner's User ID (Used for the eval command.)
const moderator = "" // Your Moderator Role name.
const autorole = "" // The role you want to assign on joining.

// After the screen is cleared.
console.log("Attempting to connect...")
client.on('ready', () => {
  console.log(`Logged in as user ${client.user.tag}.`);
  console.log(`Prefix: "${prefix}"`);
  console.log("------------ LOGS ------------")
});

// Welcome message and Autorole
client.on("guildMemberAdd", member => {
  let guild = member.guild;
  let role = guild.roles.find("name", autorole);
  member.addRole(role).catch(console.error);
  guild.defaultChannel.send(`Welcome ${member.user} to the Vortex!`);
  console.log(`${member.user.username} joined the server.`);
});

client.on("guildMemberRemove", member => {
  let guild = member.guild;
  guild.defaultChannel.send(`${member.user.username} left the server.`);
  console.log(`${member.user.username} left the server.`);
});

client.on("guildCreate", guild => {
  console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user.username}`);
});

client.on('message', message => {
  if(message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);



// add
  if (command === "add") {
    let num1 = parseInt(args[0]);
    let num2 = parseInt(args[1]);
    message.reply(num1 + num2);
  }



// subtract
  if (command === "subtract") {
    let num1 = parseInt(args[0]);
    let num2 = parseInt(args[1]);
    message.reply(num1 - num2);
  }



// multiply
  if (command === "multiply") {
    let num1 = parseInt(args[0]);
    let num2 = parseInt(args[1]);
    message.reply(num1 * num2);
  }



// divide
  if (command === "divide") {
    let num1 = parseInt(args[0]);
    let num2 = parseInt(args[1]);
    if (num1 === 0) {
      message.reply("you cant divide by zero, stoopid.");
    }
    else if (num2 === 0) {
      message.reply("you cant divide by zero, stoopid.");
    } else {
      message.reply(num1 / num2);
    }
  }



// kick
  if (command === "kick") {
    let modRole = message.guild.roles.find("name", moderator);
    if(!message.member.roles.has(modRole.id)) {
      return message.reply("yaint got the right role for that shit on foenem.");
    }
    if(message.mentions.users.size === 0) {
      return message.reply("bruh on foenem grave you better mention someone next time.");
    }
    let kickMember = message.guild.member(message.mentions.users.first());
    if(!kickMember) {
      return message.reply("who tf is that?")
    }
    if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
      return message.reply("bruh I cant.")
    }
    kickMember.kick().then(member => {
      message.channel.send(`Fuck outta here, ${member.user.username}.`);
      console.log(`${member.user.username} was kicked.`)
    });
  }



// eval (VERY DANGEROUS)
  if (command === "eval") {
    if(message.author.id !== ownerid) return;
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled));
    } catch(err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``); // shoutout to evie.codes
    }
  }



// warn
  if (command === "warn") {
    let modRole = message.guild.roles.find("name", moderator);
    if(!message.member.roles.has(modRole.id)) {
      return message.reply("who **tf** do you think you are vrodie, ya cant warn.");
    }
    if(message.mentions.users.size === 0) {
      return message.reply("bruh whomst tf do you want me to warn, yaint mentioned anyone.");
    }
    var rsn = args.join(" ");
    let warnMember = message.guild.member(message.mentions.users.first());
    if(!warnMember) {
      return message.reply("who tf is that?");
    }
    else {
      message.channel.send(`Aye ${rsn}.`);
      console.log(`${warnMember} was warned. "${rsn}"`);
    }
  }



// delete messages
  if (command === "delete") {
    let modRole = message.guild.roles.find("name", moderator);
    if(!message.member.roles.has(modRole.id)) {
      return message.reply("no.");
    } else {
      let messagecount = parseInt(args[0]);
      if (messagecount < 2) {
        message.reply("dawg that aint enough.");
      } else {
        if (messagecount >= 100) {
          message.reply("dawg thats too many.")
          } else {
            message.channel.fetchMessages({limit: messagecount + 1}).then(messages => message.channel.bulkDelete(messages)); // thank you stackoverflow
            console.log(`${messagecount} messages were deleted.`);
          }
      }
    }
  }
}); // end commands

// cleanup for eval
function clean(text) {
  if(typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

client.login(token);
