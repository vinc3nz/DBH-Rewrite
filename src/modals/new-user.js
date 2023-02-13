const moment = require('moment');
const {EmbedBuilder} = require("discord.js");
const axios = require('axios');

module.exports = {
    run: async (client, interaction) => {

        await interaction.reply("Creating your account...\n\nPlease wait...")

        if(interaction.fields.getTextInputValue('user-new-tos') !== "I agree") {
            console.log("8")
            await interaction.editReply("You have to agree to the TOS to create an account.");
            return;
        }

        let getPassword = () => {

            const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var password = "";
            while (password.length < 10) {
                password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
            }
            return password;
        };

        let password = getPassword();

        const data = {
            "username": interaction.fields.getTextInputValue('user-new-name').toLowerCase(),
            "email": interaction.fields.getTextInputValue('user-new-email').toLowerCase(),
            "first_name": interaction.fields.getTextInputValue('user-new-name'),
            "last_name": ".",
            "password": password,
            "root_admin": false,
            "language": "en"
        }


        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users",
            method: 'POST',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data,
        }).then(user => {
            userData.set(`${interaction.user.id}`, {
                discordID: interaction.user.id,
                consoleID: user.data.attributes.id,
                email: user.data.attributes.email,
                username: user.data.attributes.username,
                linkTime: moment().format("HH:mm:ss"),
                linkDate: moment().format("YYYY-MM-DD"),
                domains: []
            })

            console.log("9")
            interaction.editReply({
                embeds: [ new EmbedBuilder()
                    .setTitle("Account created successfully!")
                    .setDescription("URL: " + config.Pterodactyl.hosturl + " \nUsername: " + data.username + " \nEmail: " + data.email + " \nPassword: " + data.password)
                    .setFooter({ text: "Please note: It is recommended that you change the password" }) ]
            })

            interaction.guild.members.cache.get(interaction.user.id).roles.add(config.discord.roles.member);
        }).catch(err => {

            if(!err.response) { interaction.editReply('Oops, an error has occured.'); return }

            let errors = err.response.data.errors;

            if (errors) {
                console.log("10")
                interaction.editReply({
                    embeds: [ new EmbedBuilder()
                        .setTitle("An error has occured:")
                        .setDescription("**ERRORS:**\n\n●" + errors.map(error => error.detail.replace('\n', ' ')).join('\n●')) ]
                })
            } else {
                console.log("11")
                interaction.editReply('We hit a roadblock, please try again later.');
            }
        })
    }
};
