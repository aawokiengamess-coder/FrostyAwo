import { SlashCommandBuilder } from 'discord.js';
import { setEconomyData, getEconomyData, getMaxBankCapacity } from '../../utils/economy.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { MessageTemplates } from '../../utils/messageTemplates.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
data: new SlashCommandBuilder()
.setName('deposit')
.setDescription('Deposit money from your wallet into your bank')
.addStringOption(option =>
option
.setName('amount')
.setDescription('Amount to deposit (number or "all")')
.setRequired(true)
),

```
execute: withErrorHandling(async (interaction, config, client) => {
    const deferred = await InteractionHelper.safeDefer(interaction);
    if (!deferred) return;

    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const amountInput = interaction.options.getString('amount');

    const userData = await getEconomyData(client, guildId, userId);

    if (!userData) {
        throw createError(
            'Failed to load economy data',
            ErrorTypes.DATABASE,
            'Failed to load your economy data. Please try again later.'
        );
    }

    if ((userData.wallet || 0) >= Number.MAX_SAFE_INTEGER) {
        return InteractionHelper.safeEditReply(interaction, {
            embeds: [
                MessageTemplates.ERRORS.INVALID_INPUT(
                    'deposit',
                    '♾️ Infinite cash cannot be deposited into the bank.'
                )
            ]
        });
    }

    const maxBank = getMaxBankCapacity(userData);

    let depositAmount;

    if (amountInput.toLowerCase() === 'all') {
        depositAmount = userData.wallet || 0;
    } else {
        depositAmount = parseInt(amountInput);

        if (isNaN(depositAmount) || depositAmount <= 0) {
            throw createError(
                'Invalid deposit amount',
                ErrorTypes.VALIDATION,
                `Please enter a valid number or \`all\`.`
            );
        }
    }

    if (depositAmount <= 0) {
        throw createError(
            'No money to deposit',
            ErrorTypes.VALIDATION,
            'You do not have any money to deposit.'
        );
    }

    if (depositAmount > (userData.wallet || 0)) {
        depositAmount = userData.wallet || 0;

        await interaction.followUp({
            embeds: [
                MessageTemplates.ERRORS.INVALID_INPUT(
                    'deposit amount',
                    `You tried to deposit more than you have. Depositing **$${depositAmount.toLocaleString()}** instead.`
                )
            ],
            ephemeral: true
        });
    }

    const availableSpace = maxBank - (userData.bank || 0);

    if (availableSpace <= 0) {
        throw createError(
            'Bank full',
            ErrorTypes.VALIDATION,
            `Your bank is full. Maximum capacity: **$${maxBank.toLocaleString()}**`
        );
    }

    if (depositAmount > availableSpace) {
        depositAmount = availableSpace;

        await interaction.followUp({
            embeds: [
                MessageTemplates.ERRORS.INVALID_INPUT(
                    'bank capacity',
                    `Only **$${depositAmount.toLocaleString()}** could be deposited due to your bank limit.`
                )
            ],
            ephemeral: true
        });
    }

    userData.wallet = (userData.wallet || 0) - depositAmount;
    userData.bank = (userData.bank || 0) + depositAmount;

    await setEconomyData(client, guildId, userId, userData);

    const embed = MessageTemplates.SUCCESS.DATA_UPDATED(
        'deposit',
        `You deposited **$${depositAmount.toLocaleString()}** into your bank.`
    ).addFields(
        {
            name: '💵 Wallet',
            value: `$${userData.wallet.toLocaleString()}`,
            inline: true
        },
        {
            name: '🏦 Bank',
            value: `$${userData.bank.toLocaleString()} / $${maxBank.toLocaleString()}`,
            inline: true
        }
    );

    await InteractionHelper.safeEditReply(interaction, {
        embeds: [embed]
    });
}, { command: 'deposit' })
```

};
