import { SlashCommandBuilder } from "discord.js";
import { addMoney } from "../../utils/economy.js";

export default {
    data: new SlashCommandBuilder()
        .setName("infmoney")
        .setDescription("Give a user infinite money")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to give money to")
                .setRequired(true)
        ),

    async execute(interaction) {
        const allowedUsers = [
            "1286807101225697354", // Owner
            "1265436727858692109", // User 2
            "123456789012345678"  // User 3
        ];

        if (!allowedUsers.includes(interaction.user.id)) {
            return interaction.reply({
                content: "❌ You cannot use this command.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        await addMoney(
            interaction.client,
            interaction.guild.id,
            user.id,
            Number.MAX_SAFE_INTEGER,
            "wallet"
        );

        return interaction.reply({
            content: `💰 Successfully gave ${user} infinite money!`
        });
    }
};
