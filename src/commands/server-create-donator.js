const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const serverCreateSettings_Prem = require('../createData-Dono');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-donator")
        .setDescription("Create a donator-server.")
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The server you want to create.')
                .setRequired(true)
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
                "/user new` to create an account \nIf you already have a panel account link it using `" +
                config.DiscordBot.Prefix + "user link`");
            return;
        }

        let userP = userPrem.fetch(interaction.user.id) || {
            used: 0,
            donated: 0
        };


        let allowed = Math.floor(userP.donated / config.payment.amount_per_server);

        let pServerCreatesettings = serverCreateSettings_Prem.createParams((interaction.options.getString('name') || "change me (Settings -> Server Name)"), consoleID.consoleID);

        if (allowed === 0) {
            interaction.reply("You're not a premium user, to get access to premium you can buy a server (1server/$1)")
            return;
        }

        if ((allowed - userP.used) <= 0) {
            interaction.reply("You are at your premium server limit")
            return;
        }

        let types = {
            storage: pServerCreatesettings.storage,
            nginx: pServerCreatesettings.nginx,
            reddiscordbot: pServerCreatesettings.reddiscordbot,
            nodejs: pServerCreatesettings.nodejs,
            python: pServerCreatesettings.python,
            aio: pServerCreatesettings.aio,
            java: pServerCreatesettings.java,
            paper: pServerCreatesettings.paper,
            forge: pServerCreatesettings.forge,
            "alt:v": pServerCreatesettings.altv,
            multitheftauto: pServerCreatesettings.multitheftauto,
            "rage.mp": pServerCreatesettings.ragemp,
            "sa-mp": pServerCreatesettings.samp,
            bedrock: pServerCreatesettings.bedrock,
            pocketminemp: pServerCreatesettings.pocketminemp,
            gmod: pServerCreatesettings.gmod,
            "cs:go": pServerCreatesettings.csgo,
            "ark:se": pServerCreatesettings.arkse,
            ts3: pServerCreatesettings.ts3,
            mumble: pServerCreatesettings.mumble,
            rust: pServerCreatesettings.rust,
            mongodb: pServerCreatesettings.mongodb,
            redis: pServerCreatesettings.redis,
            postgres: pServerCreatesettings.postgres,
            daystodie: pServerCreatesettings.daystodie,
            arma: pServerCreatesettings.arma,
            assettocorsa: pServerCreatesettings.assettocorsa,
            avorion: pServerCreatesettings.avorion,
            barotrauma: pServerCreatesettings.barotrauma,
            waterfall: pServerCreatesettings.waterfall,
            spigot: pServerCreatesettings.spigot,
            sharex: pServerCreatesettings.sharex,
            codeserver: pServerCreatesettings.codeserver,
            gitea: pServerCreatesettings.gitea,
            haste: pServerCreatesettings.haste
        }

        if (Object.keys(types).includes(interaction.options.getString('type').toLowerCase())) {
            serverCreateSettings_Prem.createServer(types[interaction.options.getString('type').toLowerCase()])
                .then(response => {

                    userPrem.set(interaction.user.id + '.used', userP.used + 1);

                    let embed = new EmbedBuilder()
                        .addFields({ name: `__**Status:**__`, value: response.statusText },
                            { name: `__**Created for user ID:**__`, value: consoleID.consoleID },
                            { name: `__**Server name:**__`, value: serverName },
                            { name: `__**Type:**__`, value: serverType },
                            { name: `__**WARNING**__`, value: `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`})
                    interaction.reply(embed)

                }).catch(error => {
                interaction.reply(new EmbedBuilder().setDescription(`__**FAILED:**__ \nPlease contact a host admin. \n\nError: + error + `))
            })

        }
    }
};
