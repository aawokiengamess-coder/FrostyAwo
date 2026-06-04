js
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('session')
        .setDescription('Announce a server session')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('Server join code')
                .setRequired(true)
        ),

    async execute(interaction) {
        const code = interaction.options.getString('code');

        await interaction.reply({
            embeds: [{
                title: '🟢 Server Session Started',
                description:
`A new server session is now active!

🔑 **Server Code**
\`${code}\`

📋 **Information**
• Follow all server rules
• Respect staff members
• Use proper roleplay

👮 Hosted By: <@${interaction.user.id}>

**Join now and have fun!**`,
                color: 0x00ff00,
                timestamp: new Date()
            }]
        });
    }
};
```

