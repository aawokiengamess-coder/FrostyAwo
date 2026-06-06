import {
    SlashCommandBuilder,
    PermissionFlagsBits
} from 'discord.js';

import { createEmbed } from '../../utils/embeds.js';
import { addMoney } from '../../utils/economy.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Add money to a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to add money to')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Amount to add')
                .setRequired(true)
                .setMinValue(1)
        )
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Where to add the money')
                .addChoices(
                    { name: 'Wallet', value: 'wallet' },
                    { name: 'Bank', value: 'bank' }
                )
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const type =
            interaction.options.getString('type') || 'wallet';

        const result = await addMoney(
            client,
            interaction.guildId,
            user.id,
            amount,
            type
        );

        if (!result.success) {
            return InteractionHelper.safeEditReply(interaction, {
                content: `❌ ${result.error}`
            });
        }

        const embed = createEmbed({
            title: '💰 Money Added',
            description:
                `Successfully added **$${amount.toLocaleString()}** to ${user}.`
        }).addFields(
            {
                name: 'Location',
                value: type === 'bank' ? '🏦 Bank' : '💵 Wallet',
                inline: true
            },
            {
                name: 'New Balance',
                value: `$${result.newBalance.toLocaleString()}`,
                inline: true
            }
        );

        await InteractionHelper.safeEditReply(interaction, {
            embeds: [embed]
        });
    }, { command: 'addmoney' })
};
