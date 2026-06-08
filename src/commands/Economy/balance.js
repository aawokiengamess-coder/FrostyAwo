import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { getEconomyData, getMaxBankCapacity } from '../../utils/economy.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Check your or someone else's balance")
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to check balance for')
                .setRequired(false)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const targetUser = interaction.options.getUser("user") || interaction.user;
        const guildId = interaction.guildId;

        logger.debug(`[ECONOMY] Balance check for ${targetUser.id}`, {
            userId: targetUser.id,
            guildId
        });

        if (targetUser.bot) {
            throw createError(
                "Bot user queried for balance",
                ErrorTypes.VALIDATION,
                "Bots don't have an economy balance."
            );
        }

        const userData = await getEconomyData(client, guildId, targetUser.id);

        if (!userData) {
            throw createError(
                "Failed to load economy data",
                ErrorTypes.DATABASE,
                "Failed to load economy data. Please try again later.",
                { userId: targetUser.id, guildId }
            );
        }

        const maxBank = getMaxBankCapacity(userData);

        const isInfWallet = (userData.wallet || 0) >= Number.MAX_SAFE_INTEGER;
        const isInfBank = (userData.bank || 0) >= Number.MAX_SAFE_INTEGER;

        const walletDisplay = isInfWallet
            ? "♾️ Infinite"
            : `$${(userData.wallet || 0).toLocaleString()}`;

        const bankDisplay = isInfBank
            ? "♾️ Infinite"
            : `$${(userData.bank || 0).toLocaleString()} / $${maxBank.toLocaleString()}`;

        const totalDisplay = (isInfWallet || isInfBank)
            ? "♾️ Infinite"
            : `$${((userData.wallet || 0) + (userData.bank || 0)).toLocaleString()}`;

        const embed = createEmbed({
            title: `💰 ${targetUser.username}'s Balance`,
            description: `Here is the current financial status for ${targetUser.username}.`,
        })
            .addFields(
                {
                    name: "💵 Cash",
                    value: walletDisplay,
                    inline: true,
                },
                {
                    name: "🏦 Bank",
                    value: bankDisplay,
                    inline: true,
                },
                {
                    name: "♾️ Total",
                    value: totalDisplay,
                    inline: true,
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            });

        logger.info(`[ECONOMY] Balance retrieved`, {
            userId: targetUser.id,
            wallet: userData.wallet,
            bank: userData.bank
        });

        await InteractionHelper.safeEditReply(interaction, {
            embeds: [embed]
        });
    }, { command: 'balance' })
};
