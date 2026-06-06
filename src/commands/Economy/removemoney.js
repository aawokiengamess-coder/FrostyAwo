import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { getEconomyData, setEconomyData } from '../../utils/economy.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const AUTHORIZED_IDS = [
    '1286807101225697354', // Owner
    // Add your friend's ID here
];

export default {
    data: new SlashCommandBuilder()
        .setName('removemoney')
        .setDescription('Owner only economy management')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Target user')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Money type')
                .setRequired(true)
                .addChoices(
                    { name: 'Wallet', value: 'wallet' },
                    { name: 'Bank', value: 'bank' }
                )
        )
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Remove amount or wipe balance')
                .setRequired(true)
                .addChoices(
                    { name: 'Amount', value: 'amount' },
                    { name: 'Wipe', value: 'wipe' }
                )
        )
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Amount to remove')
                .setRequired(false)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        if (!AUTHORIZED_IDS.includes(interaction.user.id)) {
            return InteractionHelper.safeEditReply(interaction, {
                content: '❌ You do not have permission to use this command.'
            });
        }

        const user = interaction.options.getUser('user');
        const type = interaction.options.getString('type');
        const mode = interaction.options.getString('mode');
        const amount = interaction.options.getInteger('amount') || 0;

        const data = await getEconomyData(
            client,
            interaction.guildId,
            user.id
        );

        if (mode === 'wipe') {
            data[type] = 0;
        } else {
            data[type] = Math.max(0, (data[type] || 0) - amount);
        }

        await setEconomyData(
            client,
            interaction.guildId,
            user.id,
            data
        );

        const embed = createEmbed({
            title: '💸 Money Removed',
            description: `Updated ${user}'s ${type}.`
        });

        await InteractionHelper.safeEditReply(interaction, {
            embeds: [embed]
        });
    }, { command: 'removemoney' })
};
