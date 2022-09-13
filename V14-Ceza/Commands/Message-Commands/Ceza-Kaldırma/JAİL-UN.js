const {discord, EmbedBuilder,AttachmentBuilder,PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle ,ApplicationCommandPermissionsManager, DataResolver  } = require("discord.js")
const cevap = require("../../../Config/cevaplar")
const rol = require("../../../Config/roller")
const emojiler = require("../../../Config/emojiler")
const kanallar = require("../../../Config/kanallar")
const settings = require("../../../Config/settings")
const randomstring = require("random-string")
const isimler = require("../../../schemas/isimler")
const penals = require("../../../schemas/penals")
const ceza = require("../../../schemas/ceza");
const cezapuan = require("../../../schemas/cezapuan")
module.exports = {
    command: {
        name: ["unjail","jailkaldır"],
        desc: "Un-Jail",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!message.member.roles.cache.has(rol.roller.JailPerm) && !message.member.roles.cache.has(rol.roller.Owner) && !message.member.roles.cache.has(rol.roller.Owner2) && !message.member.roles.cache.has(rol.roller.Ceo) && !message.member.roles.cache.has(rol.roller.PANKART) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)){  
            const embed = new EmbedBuilder() 
            .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
            .setDescription(cevap.cevaplar.NotPerm)
            .setColor(client.redColor())
            .setFooter({text : message.guild.name})
            message.reply({embeds : [embed]})
            return
        }
        if(!üye){
        const embed = new EmbedBuilder() 
            .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
            .setDescription(cevap.cevaplar.NotMember)
            .setColor(client.redColor())
            .setFooter({text : message.guild.name})
            message.reply({embeds : [embed]})
            return
        }
        const data = await penals.findOne({ userID: üye.user.id, guildID: message.guild.id, $or: [{ type: "JAIL" }, { type: "TEMP-JAIL" }], active: true });
        if(data === null && !üye.roles.cache.has(rol.roller.JailRole)){
                const embed = new EmbedBuilder() 
                    .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                    .setDescription(cevap.cevaplar.NotFoundJail)
                    .setColor(client.redColor())
                    .setFooter({text : message.guild.name})
                    message.reply({embeds : [embed]})
                    return
        }
        if(üye.roles.cache.has(rol.roller.JailRole)) await üye.roles.set(rol.UnRegRoles)
        if (data) {
            data.active = false;
            await data.save();
          }
          const embed = new EmbedBuilder() 
          .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
          .setDescription(`${üye} ` +  cevap.cevaplar.UnJail + `\n Kaldırılma Zamanı : <t:${parseInt(Date.now() / 1000)}:F>`)
          .setColor(client.greenColor())
          .setThumbnail(üye.displayAvatarURL({dynamic : true , size : 4096}))
          .setFooter({text : message.guild.name})
          await message.reply({embeds : [embed]})
          const embeds = new EmbedBuilder() 
          .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
          .setDescription(`
          ${üye} Kullanıcısının **jail** cezası kaldırıldı.
          Cezayı Kaldıran Yetkili : ${message.member}
          Cezanın Kaldırılma Tarihi : <t:${parseInt(Date.now() / 1000)}:F>
          `)
          .setColor(client.redColor())
          .setFooter({text : message.guild.name})
          .setThumbnail(üye.displayAvatarURL({dynamic : true , size : 4096}))
          await message.guild.channels.cache.get(kanallar.cezaLog.JailLog).send({embeds : [embeds]})
    }}