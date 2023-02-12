const { InteractionType } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    execute: async(interaction) => {
        let client = interaction.client;
        if (interaction.type === InteractionType.ApplicationCommand) {
            if(interaction.user.bot) return;
            try {
                const command = client.commands.get(interaction.commandName)
                command.run(client, interaction)
            } catch {
                interaction.reply({content: "Interaction not registered in bot", ephemeral: true})
            }
        } else if(interaction.isModalSubmit()) {
            if(interaction.user.bot) return;
            if(interaction.customId === 'user-new-modal') {
                const modal = require("../modals/new-user");
                modal.run(client, interaction);
            }
        }
    }}