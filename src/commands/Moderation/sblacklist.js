```js
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverblacklist')
    .setDescription('Blacklist a Discord server')
    .addStringOption(option =>
      option
        .setName('serverid')
        .setDescription('The server ID')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for blacklisting')
        .setRequired(true)
    ),

  async execute(interaction) {
    const serverId = interaction.options.getString('serverid');
    const reason = interaction.options.getString('reason');

    await interaction.reply({
      embeds: [{
        title: '🚫 Server Blacklisted',
        description:
`**Server ID:** \`${serverId}\`
**Reason:** ${reason}
**Moderator:** ${interaction.user}`,
        color: 0xff0000,
        timestamp: new Date()
      }]
    });
  }
};
```
