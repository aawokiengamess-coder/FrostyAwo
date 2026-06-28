const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");
const fs = require("fs");

const STAFF_ROLE = "1506400838606917633";
const MANAGER_ROLE = "1515132665010065540";

const FILE = "./loa.json";

module.exports = {
    name: "loa",
    description: "Create a Leave of Absence.",

    async execute(message, args) {

        if (!message.member.roles.cache.has(STAFF_ROLE))
            return message.reply("❌ You must be staff to use this command.");

        let target = message.mentions.members.first();

        // Default to yourself
        if (!target) target = message.member;

        // Managers only for other users
        if (
            target.id !== message.author.id &&
            !message.member.roles.cache.has(MANAGER_ROLE)
        ) {
            return message.reply("❌ Only managers can place other users on LOA.");
        }

        const reason = args
            .slice(target.id === message.author.id ? 0 : 1)
            .join(" ");

        if (!reason)
            return message.reply(
                "Usage:\n!loa <reason>\n!loa @user <reason> (Managers only)"
            );

        let data = {};

        if (fs.existsSync(FILE))
            data = JSON.parse(fs.readFileSync(FILE));

        data[target.id] = {
            username: target.user.tag,
            reason,
            approvedBy: message.author.tag,
            date: new Date().toISOString()
        };

        fs.writeFileSync(FILE, JSON.stringify(data, null, 4));

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("📅 Leave of Absence")
            .addFields(
                {
                    name: "User",
                    value: `${target}`,
                    inline: true
                },
                {
                    name: "Approved By",
                    value: `${message.author}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason
                }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
