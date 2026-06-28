import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('View bot credits'),

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);

      await InteractionHelper.safeEditReply(interaction, {
        embeds: [
          createEmbed({
            title: '📜 Credits',
            description: `
## SnowyAwo Moderation

👑 **Owner & Developer**
SnowyAwo


🎨 **Design**
SnowyAwo

🧪 **Server Staff**
SnowyAwo
1dgkids2012
Pekky

━━━━━━━━━━━━━━━━━━

© 2026 SnowyAwo
All Rights Reserved.
`,
            thumbnail: interaction.client.user.displayAvatarURL({
              forceStatic: false,
              size: 1024,
            }),
            footer: {
              text: 'SnowyAwo Moderation • Credits',
            },
          }),
        ],
      });
    } catch (error) {
      logger.error('Credits command error:', error);
    }
  },
}; 
