import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("resetallmoney")
        .setDescription("Reset all economy balances")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const OWNER_ID = "1286807101225697354";

        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({
                content: "❌ Only the bot owner can use this command.",
                ephemeral: true
            });
        }

        const allData = await interaction.client.db.all();

        let resetCount = 0;

        for (const entry of allData) {
            if (!entry.id.startsWith("economy:")) continue;

            const data = entry.value;

            data.wallet = 0;
            data.bank = 0;

            await interaction.client.db.set(entry.id, data);
            resetCount++;
        }

        await interaction.reply(
            `✅ Reset economy balances for ${resetCount} users.`
        );
    }
};
