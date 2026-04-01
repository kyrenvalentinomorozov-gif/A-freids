module.exports = {
  config: {
    name: "top",
    aliases: ["leaderboard", "rich"],
    version: "1.1",
    author: "lonely",
    shortDescription: "Top richest users",
    longDescription: "Show leaderboard with mentions",
    category: "economy",
    guide: "{pn}"
  },

  onStart: async function ({ message, usersData }) {
    try {
      const allUsers = await usersData.getAll();

      const sorted = allUsers
        .filter(u => u.money && u.money > 0)
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);

      if (sorted.length === 0) {
        return message.reply("⚠️ No users with money yet.");
      }

      let msg = "🏆 TOP RICHEST USERS 🏆\n\n";
      let mentions = [];

      for (let i = 0; i < sorted.length; i++) {
        const user = sorted[i];
        const name = user.name || "User";
        const money = user.money || 0;
        const uid = user.userID || user.uid || user.id;

        msg += `${i + 1}. ${name}\n💰 ${money}\n\n`;

        if (uid) {
          mentions.push({
            id: uid,
            tag: name
          });
        }
      }

      return message.reply({
        body: msg,
        mentions
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error loading leaderboard.");
    }
  }
};