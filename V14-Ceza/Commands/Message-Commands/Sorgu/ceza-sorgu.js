const {discord, EmbedBuilder,AttachmentBuilder,PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle ,ApplicationCommandPermissionsManager  } = require("discord.js")
const cevap = require("../../../Config/cevaplar")
const rol = require("../../../Config/roller")
const emojiler = require("../../../Config/emojiler")
const kanallar = require("../../../Config/kanallar")
const settings = require("../../../Config/settings")
const randomstring = require("random-string")
const isimler = require("../../../schemas/isimler")
const ceza = require("../../../schemas/ceza");
const cezapuan = require("../../../schemas/cezapuan")
const penals = require("../../../schemas/penals");
const roller = require("../../../Config/roller")
const moment = require("moment")
module.exports = {
    command: {
        name: ["cezasorgu"],
        desc: "Ceza Sorgu",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        if(!args[0]){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`Bir ceza ID girmelisin.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }
        if (isNaN(args[0])){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`Ceza ID bir sayı olmalıdır.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }
        const data = await penals.findOne({ guildID: message.guild.id, id: args[0] });
        if (!data){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${args[0]} ID'li bir ceza bulunamadı!.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
         return
        }
        let datasorgu = `
         Tarih : <t:${parseInt(data.date / 1000)}:F> 
         Yetkili : <@${data.staff}>
         Sebep : \`${data.reason}\` 
         Ceza tipi : **[${data.type}]**
         Ceza id : **#${data.id}**
         Ceza ${data.active ? `hâlâ aktif. ${emojiler.onay}` : `deaktif. ${emojiler.red}` }`
         let üye = await client.users.fetch(data.userID)
         const embed = new EmbedBuilder()
         .setAuthor({name :  üye.username , iconURL :   üye.displayAvatarURL({dynamic: true , size : 4096})})
         .setDescription(`${datasorgu}`)
         .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
         .setColor(client.redColor())
         .setThumbnail(üye.displayAvatarURL({dynamic: true , size : 4096}))
         await message.reply({embeds : [embed]})

    }}