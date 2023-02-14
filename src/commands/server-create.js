const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const createData = require("../../serverData/createData.json")
const serverCreateSettings = require('../createData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create a server.")
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The server you want to create.')
                .setRequired(true)
                .addChoices(    {
                        "name": "Nginx",
                        "value": "nginx"
                    },
                    {
                        "name": "Red Discord Bot",
                        "value": "reddiscordbot"
                    },
                    {
                        "name": "NodeJs",
                        "value": "nodejs"
                    },
                    {
                        "name": "Python",
                        "value": "python"
                    },
                    {
                        "name": "All-in-one",
                        "value": "aio"
                    },
                    {
                        "name": "Java",
                        "value": "java"
                    },
                    {
                        "name": "MongoDB",
                        "value": "mongodb"
                    },
                    {
                        "name": "Redis",
                        "value": "redis"
                    },
                    {
                        "name": "PostgreSQL",
                        "value": "postgres"
                    },
                    {
                        "name": "ShareX Server",
                        "value": "sharex"
                    },
                    {
                        "name": "VisualStudio Web",
                        "value": "codeserver"
                    },
                    {
                        "name": "Gitea",
                        "value": "gitea"
                    },
                    {
                        "name": "Hastebin Server",
                        "value": "haste"
                    })
        )
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the server.')
                .setMaxLength(2000)
        ),
    run: async (client, interaction) => {
        let consoleID = userData.get(interaction.user.id);

        if (consoleID == null) {
            interaction.reply("Oh no, Seems like you do not have a panel account linked to your Discord account.\n" +
                "If you have not made a panel account yet please check out `" +
                "/user new` to create an account \nIf you already have a panel account link it to your Discord account using `" +
                config.DiscordBot.Prefix + "user link`");
            return;
        }

        let loadingEmbed = new EmbedBuilder()
            .setTitle("Loading...")
            .setDescription("Please wait while we create your server.")
            .setTimestamp()
            .setImage("https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif")

        await interaction.reply({ embeds: [loadingEmbed] });

        let serverType = interaction.options.getString('type');
        let serverName = interaction.options.getString('name') || "change me (Settings -> Server Name)";

        let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

        let types = {
            storage: data.storage,
            nginx: data.nginx,
            reddiscordbot: data.reddiscordbot,
            nodejs: data.nodejs,
            python: data.python,
            aio: data.aio,
            java: data.java,
            //paper: data.paper,
            //forge: data.forge,
            //"alt:v": data.altv,
            //multitheftauto: data.multitheftauto,
            //"rage.mp": data.ragemp,
            //"sa-mp": data.samp,
            //bedrock: data.bedrock,
            //pocketminemp: data.pocketminemp,
            //gmod: data.gmod,
            //"cs:go": data.csgo,
            //"ark:se": data.arkse,
            ts3: data.ts3,
            mumble: data.mumble,
            //rust: data.rust,
            mongodb: data.mongodb,
            redis: data.redis,
            postgres: data.postgres,
            //daystodie: data.daystodie,
            //arma: data.arma,
            //assettocorsa: data.assettocorsa,
            //avorion: data.avorion,
            //barotrauma: data.barotrauma,
            //waterfall: data.waterfall,
            //spigot: data.spigot,
            sharex: data.sharex,
            codeserver: data.codeserver,
            gitea: data.gitea,
            haste: data.haste
        };
            serverCreateSettings.createServer(types[serverType])
                .then(response => {
                    let embed = new EmbedBuilder()
                        .addFields({ name: `__**Status:**__`, value: response.statusText },
                            { name: `__**Created for user ID:**__`, value: consoleID.consoleID },
                            { name: `__**Server name:**__`, value: serverName },
                            { name: `__**Type:**__`, value: serverType },
                            { name: `__**WARNING**__`, value: `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`})
                    interaction.editReply({ embeds: [embed]})
                }).catch(error => {
                    if(error.response)
                        console.log(error.response.data)
                if (error === "Error: Request failed with status code 400") {
                    const embed = new EmbedBuilder()
                        .addFields({ name: `__**Failed to create a new server**__`, value: `The node is currently full, Please check <#898327108898684938> for updates.` });
                    interaction.editReply({ embeds: [embed]})
                } else {
                    if(error === "Error: Received one or more errors") { interaction.reply("Server created. Something is wrong with the API/Bot"); return; }
                    const embed = new EmbedBuilder()
                        .addFields({ value: "```\n" + error + "```", name: `__**Failed to create a new server**__`});
                    interaction.editReply({ embeds: [embed] })
                }
            })
        }
};
