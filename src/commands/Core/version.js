import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const BOT_NAME = 'SnowyAwo Moderation';
const BOT_VERSION = '2.0';
const BOT_DEVELOPER = 'SnowyAwo';

export default {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Displays information about the bot'),

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);

      const totalSeconds = interaction.client.uptime / 1000;
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      await InteractionHelper.safeEditReply(interaction, {
        embeds: [
          createEmbed({
            title: `🤖 ${BOT_NAME}`,
            description: `
## Bot Information

> Official system information and statistics.

**📛 Bot Name**
${BOT_NAME}

**👨‍💻 Developer**
${BOT_DEVELOPER}

**📦 Version**
v${BOT_VERSION}

**📊 Statistics**
🌐 Servers: ${interaction.client.guilds.cache.size}
👥 Users: ${interaction.client.users.cache.size.toLocaleString()}
⏱️ Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s

**⚙️ Runtime**
🟢 Status: Online
⚡ Discord.js v14
🖥️ Node.js ${process.version}

━━━━━━━━━━━━━━━━━━

**✨ Features**
• Moderation Commands
• Utility Commands
• Logging System
• Permission Management
• Security Systems
• Server Configuration

━━━━━━━━━━━━━━━━━━

Thank you for using ${BOT_NAME}.
`,
            thumbnail: interaction.client.user.displayAvatarURL({
              dynamic: true,
              size: 1024,
            }),
            footer: {
              text: `${BOT_NAME} • Developed by ${BOT_DEVELOPER} • v${BOT_VERSION}`,
            },
          }),
        ],
      });
    } catch (error) {
      logger.error('BotInfo command error:', error);

      try {
        await InteractionHelper.safeEditReply(interaction, {
          embeds: [
            createEmbed({
              title: '❌ System Error',
              description: 'Failed to retrieve bot information.',
              color: 'error',
            }),
          ],
          flags: MessageFlags.Ephemeral,
        });
      } catch (replyError) {
        logger.error('Failed to send error reply:', replyError);
      }
    }
  },
};
