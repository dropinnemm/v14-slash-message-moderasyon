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
module.exports = {
    command: {
        name: ["ban","yasakla"],
        desc: "Ban",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const reason = args.slice(1).join(" ")
        if(!message.member.roles.cache.has(rol.roller.BanPerm) && !message.member.roles.cache.has(rol.roller.Owner) && !message.member.roles.cache.has(rol.roller.Owner2) && !message.member.roles.cache.has(rol.roller.Ceo) && !message.member.roles.cache.has(rol.roller.PANKART) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)){  
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
        if(!reason){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`Kullanıcıyı yasaklamak için sebep belitmelisin.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
            }
        if(message.member.roles.highest.position <= üye.roles.highest.position){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kullanıcısı sizle aynı yada üst pozisyonda olduğundan dolayı kullanıcıyı yasaklıyamazsınız.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
            }
        if(üye.bannable === false){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kullanıcısını sunucudan yasaklıyamazsınız.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }
       
        üye.ban({ reason: `${reason} ' Yetkili: ${message.author.tag}` , deleteMessageDays: 1}).catch(() => {});
        if (settings.dmMessages === true){
            üye.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandınız!`}).catch(() => {})
        }
        const penal = await client.penalize(message.guild.id, üye.id, "BAN", true, message.author.id, reason);
        
        
        const embed = new EmbedBuilder()
        .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`
        ${üye} (${üye.id}) üyesi sunucudan **${reason}** sebebiyle <t:${parseInt(Date.now() / 1000)}:F> tarihinde **yasaklandı**. Ceza numarası : **#${penal.id}**`)
        .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor())
        await message.react(emojiler.onay)
        await message.reply({embeds : [embed]})
        await client.channels.cache.get(kanallar.cezaLog.BanLog).send({embeds : [embed]})
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $push: { names: { name: üye.displayName, yetkili: message.author.id, rol: "Ban", date: Date.now() } } }, { upsert: true });
        
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: üye.user.id });
        if(kanallar.cezaLog.CezaPuan) 
        {
            message.guild.channels.cache.get(kanallar.cezaLog.CezaPuan)
            .send({ content:`${üye} üyesi **ban** cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
        }
    
    
    }
    }