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
const roller = require("../../../Config/roller")
module.exports = {
    command: {
        name: ["cezapuan","c-puan","cpuan"],
        desc: "Ceza Puan",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!message.member.roles.cache.has(rol.roller.JailPerm) && !message.member.roles.cache.has(rol.roller.Owner) && !message.member.roles.cache.has(rol.roller.Owner2) && !message.member.roles.cache.has(rol.roller.Ceo) && !message.member.roles.cache.has(rol.roller.PANKART) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)){  
            const embed = new EmbedBuilder() 
            .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
            .setDescription(cevap.cevaplar.NotPerm)
            .setColor(client.redColor())
            .setThumbnail(message.member.user.displayAvatarURL({dynamic : true , size : 4096}))
            .setFooter({text : message.guild.name})
            message.reply({embeds : [embed]})
            return
        }
        if(!üye){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(cevap.cevaplar.NotMember)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }

        const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: üye.user.id });
        const cezapuanData = await cezapuan.findOne({ userID: üye.user.id });
        message.react(emojiler.onay)
        const embed = new EmbedBuilder()
        .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`
        ${üye} üyesinin toplamda \`${cezapuanData ? cezapuanData.cezapuan : 0}\` ceza puanına sahip.
        Toplam **${cezaData ? cezaData.ceza.length : 0}** ceza almış!
        `)
        .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor())
        message.reply({ embeds:[embed]})

        
    }}