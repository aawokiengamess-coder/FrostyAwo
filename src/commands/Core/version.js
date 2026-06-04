import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const BOT_VERSION = '1.0';
const BOT_DEVELOPER = 'Awokien';

export default {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('View information about the bot'),

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);

      await InteractionHelper.safeEditReply(interaction, {
        embeds: [
          createEmbed({
            title: '🤖 Bot Information',
            description:
              `**Developer:** ${BOT_DEVELOPER}\n` +
              `**Version:** ${BOT_VERSION}\n` +
              `**Bot Name:** ${interaction.client.user.username}\n` +
              `**Servers:** ${interaction.client.guilds.cache.size}\n` +
              `**Users:** ${interaction.client.users.cache.size.toLocaleString()}`
          })
        ]
      });
    } catch (error) {
      logger.error('BotInfo command error:', error);

      try {
        await InteractionHelper.safeEditReply(interaction, {
          embeds: [
            createEmbed({
              title: 'System Error',
              description: 'Could not retrieve bot information.',
              color: 'error'
            })
          ],
          flags: MessageFlags.Ephemeral
        });
      } catch (replyError) {
        logger.error('Failed to send error reply:', replyError);
      }
    }
  }
};
