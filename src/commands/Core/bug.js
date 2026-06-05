import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import { createEmbed } from '../../utils/embeds.js';

const OWNER_ID = '1286807101225697354';

export default {
    data: new SlashCommandBuilder()
        .setName('bug')
        .setDescription('Report a bug or issue'),

    async execute(interaction) {

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('📎 Report Bug on GitHub')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/aawokiengamess-coder/FrostyAwo-Bugs/issues'),

            new ButtonBuilder()
                .setCustomId('report_to_staff')
                .setLabel('📨 Report To Staff')
                .setStyle(ButtonStyle.Primary)
        );

        const embed = createEmbed({
            title: '🐛 Bug Reports',
            description:
                'Found a bug?\n\n' +
                '• Use GitHub for public reports\n' +
                '• Use Report To Staff for private reports'
        });

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        const message = await interaction.fetchReply();

        const collector = message.createMessageComponentCollector({
            time: 300000
        });

        collector.on('collect', async i => {
            if (i.customId !== 'report_to_staff') return;

            const modal = new ModalBuilder()
                .setCustomId('bug_report_modal')
                .setTitle('Bug Report');

            const reportInput = new TextInputBuilder()
                .setCustomId('report')
                .setLabel('Describe the bug')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(2000);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reportInput)
            );

            await i.showModal(modal);

            const submitted = await i.awaitModalSubmit({
                time: 300000,
                filter: modalInteraction =>
                    modalInteraction.customId === 'bug_report_modal' &&
                    modalInteraction.user.id === i.user.id
            });

            const report =
                submitted.fields.getTextInputValue('report');

            const owner =
                await interaction.client.users.fetch(OWNER_ID);

            await owner.send({
                embeds: [
                    createEmbed({
                        title: '🐛 New Bug Report',
                        description:
                            `**User:** ${submitted.user.tag}\n` +
                            `**User ID:** ${submitted.user.id}\n` +
                            `**Server:** ${submitted.guild?.name ?? 'DM'}\n\n` +
                            `**Report:**\n${report}`,
                        color: 'error'
                    })
                ]
            });

            await submitted.reply({
                content: '✅ Your report has been sent to staff.',
                ephemeral: true
            });
        });
    }
};
