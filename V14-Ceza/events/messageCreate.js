const { EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    name: 'messageCreate',
    async run(client, message) {

        const kanallar = require("../Config/kanallar")
        const cevaplar = require("../Config/cevaplar")
        const emojiler = require("../Config/emojiler")
        const roller = require("../Config/roller")
        const settings = require("../Config/settings")
        const prefix = client.config.prefix
        if (message.author.bot) return;
        if (!message.content.startsWith(`${prefix}`)) return;
        const command = message.content.split(" ")[0].slice(prefix.length)
        let args = message.content.split(" ")
        args.shift()
        const clientcmd = client.mcommands.get(command)
        if(!clientcmd) return;
        clientcmd.run({ client, message, args , kanallar, cevaplar, emojiler, roller, settings})
    }
}
