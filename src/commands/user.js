const { EmbedBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("All user-related commands.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Create a new user.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("link")
                .setDescription("Link your Discord account to your user.")
        ),
    run: async (client, interaction) => {

        let getPassword = () => {

            const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            let password = "";
            while (password.length < 10) {
                password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
            }
            return password;
        };

        switch (interaction.options.getSubcommand()) {
            case "new":
                if (userData.get(interaction.user.id) != null) {
                    interaction.reply("You already have a `panel account` linked to your discord account");
                    return;
                }


                const modal = new ModalBuilder()
                    .setTitle("Create a new account")
                    .setCustomId("user-new-modal");

                const emailInput = new TextInputBuilder()
                    .setCustomId("user-new-email")
                    .setPlaceholder("Email")
                    .setMinLength(1)
                    .setMaxLength(2000)
                    .setLabel("Enter your E-Mail address here.")
                    .setStyle(TextInputStyle.Short);

                const userInput = new TextInputBuilder()
                    .setCustomId("user-new-name")
                    .setPlaceholder("Username")
                    .setMinLength(1)
                    .setMaxLength(2000)
                    .setLabel("Enter your username here.")
                    .setStyle(TextInputStyle.Short);

                const tosInput = new TextInputBuilder()
                    .setCustomId("user-new-tos")
                    .setPlaceholder("'I agree' to accept TOS")
                    .setMinLength(7)
                    .setMaxLength(7)
                    .setLabel("TOS: https://danbot.host/tos")
                    .setStyle(TextInputStyle.Short);

                const firstActionRow = new ActionRowBuilder().addComponents(emailInput);
                const secondActionRow = new ActionRowBuilder().addComponents(userInput);
                const thirdActionRow = new ActionRowBuilder().addComponents(tosInput);

                // Add inputs to the modal
                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

                await interaction.showModal(modal);

                break;
            case "link":
                interaction.reply({content: "This command is not ready yet. Please open a ticket to link your account!", ephemeral: true})
                break;
        }
    }
};