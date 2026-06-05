js
import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

import { createEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('bug')
        .setDescription('Report a bug or issue with the bot'),

    async execute(interaction) {
        const githubButton = new ButtonBuilder()
            .setLabel('📎 Report Bug on GitHub')
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/aawokiengamess-coder/FrostyAwo-Bugs/issues');

        const supportButton = new ButtonBuilder()
            .setLabel('📨 Report To Staff')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('report_to_staff');

        const row = new ActionRowBuilder().addComponents(
            githubButton,
            supportButton
        );

        const embed = createEmbed({
            title: '🐛 Bug Reports',
            description:
                'Found a bug?\n\n' +
                '• Use GitHub for public bug reports\n' +
                '• Use "Report To Staff" for private reports\n\n' +
                'Please include as much detail as possible.',
            color: 'error'
        });

        await InteractionHelper.safeReply(interaction, {
            embeds: [embed],
            components: [row]
        });
    }
};


