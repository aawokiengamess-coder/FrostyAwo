```js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const BLACKLIST_CHANNEL_ID = 'CHANNEL_ID_HERE';

export default {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist a member from the server')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to blacklist')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the blacklist')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const embed = {
            title: '🚫 Server Blacklist',
            color: 0xff0000,
            thumbnail: {
                url: user.displayAvatarURL()
            },
            fields: [
                {
                    name: 'User',
                    value: `${user} (\`${user.id}\`)`,
                    inline: false
                },
                {
                    name: 'Reason',
                    value: reason,
                    inline: false
                },
                {
                    name: 'Issued By',
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: 'Status',
                    value: 'Blacklisted',
                    inline: true
                }
            ],
            timestamp: new Date()
        };

        const channel = interaction.client.channels.cache.get(BLACKLIST_CHANNEL_ID);

        if (channel) {
            await channel.send({ embeds: [embed] });
        }

        await interaction.reply({
            content: `✅ ${user.tag} has been added to the server blacklist.`,
            ephemeral: true
        });
    }
};
```
