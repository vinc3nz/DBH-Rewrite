const { Client, Collection, GatewayIntentBits, Partials, Events } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const config = require("./config.json");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
let db = require("quick.db");
const fs = require("fs");

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(config.DiscordBot.Token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };

global.userData = new db.table("userData"); //User data, Email, ConsoleID, Link time, Username, DiscordID
global.settings = new db.table("settings"); //Admin settings
global.webSettings = new db.table("webSettings"); //Web settings (forgot what this is even for)
global.mutesData = new db.table("muteData"); //Mutes, Stores current muted people and unmute times
global.domains = new db.table("linkedDomains"); //Linked domains for unproxy and proxy cmd
global.nodeStatus = new db.table("nodeStatus"); //Node status. Online or offline nodes
global.userPrem = new db.table("userPrem"); //Premium user data, Donated, Boosted, Total
global.nodeServers = new db.table("nodeServers"); //Server count for node limits to stop nodes becoming overloaded
global.codes = new db.table("redeemCodes"); //Premium server redeem codes...
global.sudo = new db.table("sudoCommands"); //Keep track of staff sudo
global.lastBotClaim = new db.table("lastBotClaim"); //Keep track of staff sudo
global.nodePing = new db.table("nodePing"); //Node ping response time
global.config = config;

global.createList = {}
global.createListPrem = {};

global.getPassword = function getPassword()  {

    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let password = "";
    while (password.length < 10) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
}


//Import all create server lists
fs.readdir('./create-free/', (err, files) => {
    files = files.filter(f => f.endsWith('.js'));
    files.forEach(f => {
        require(`./create-free/${f}`);
    });
});

fs.readdir('./create-premium/', (err, files) => {
    files = files.filter(f => f.endsWith('.js'));
    files.forEach(f => {
        require(`./create-premium/${f}`);
    });
});

//command-handler
const commands = [];
readdirSync('./src/commands').forEach(async file => {
    const command = require(`./src/commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
    log(`Loaded command: ${command.data.name}`);
})

client.on("ready", async () => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
    log(`${client.user.username} was started.!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
})

//nodejs-events
process.on("unhandledRejection", e => {
    console.log(e)
})
process.on("uncaughtException", e => {
    console.log(e)
})
process.on("uncaughtExceptionMonitor", e => {
    console.log(e)
})
//

client.login(config.DiscordBot.Token)