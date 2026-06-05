
import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} from 'discord.js';

import { createEmbed } from '../utils/embeds.js';

const OWNER_ID = '1286807101225697354';

export default {
    name: 'interactionCreate',

    async execute(interaction) {

        if (
            interaction.isButton() &&
            interaction.customId === 'report_to_staff'
        ) {
            const modal = new ModalBuilder()
                .setCustomId('bug')
                .setTitle('Report A Bug');

            const bugInput = new TextInputBuilder()
                .setCustomId('bug_description')
                .setLabel('What is the bug?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(2000);

            modal.addComponents(
                new ActionRowBuilder().addComponents(bugInput)
            );

            return interaction.showModal(modal);
        }

        if (
            interaction.isModalSubmit() &&
            interaction.customId === 'bug'
        ) {
            const report =
                interaction.fields.getTextInputValue(
                    'bug_description'
                );

            try {
                const owner =
                    await interaction.client.users.fetch(
                        OWNER_ID
                    );

                await owner.send({
                    embeds: [
                        createEmbed({
                            title: '🐛 New Bug Report',
                            description:
                                `**Reporter:** ${interaction.user.tag}\n` +
                                `**User ID:** ${interaction.user.id}\n` +
                                `**Server:** ${interaction.guild?.name || 'DM'}\n\n` +
                                `**Report:**\n${report}`,
                            color: 'error'
                        })
                    ]
                });

                await interaction.reply({
                    content:
                        '✅ Your bug report has been sent to staff.',
                    ephemeral: true
                });

            } catch (error) {
                console.error(error);

                await interaction.reply({
                    content:
                        '❌ Failed to send the report.',
                    ephemeral: true
                });
            }
        }
    }
};


