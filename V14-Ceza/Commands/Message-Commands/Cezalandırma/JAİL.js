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
        name: ["jail","karantina"],
        desc: "Jail",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const reason = args.slice(1).join(" ")
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
        if(!reason){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`Kullanıcıyı jaillemek için sebep belitmelisin.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
            }
        if(message.member.roles.highest.position <= üye.roles.highest.position){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kullanıcısı sizle aynı yada üst pozisyonda olduğundan dolayı kullanıcıyı jailleyemezsin.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
            }
        if(üye.manageable === false){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kullanıcısını sunucuda jailleyemezsiniz.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }
     
        await üye.roles.set([roller.roller.JailRole])
        if(üye.voice.channel) üye.voice.disconnect().catch();

        if (settings.dmMessages === true){
            üye.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle jaillendiniz!`}).catch(() => {})
        }
        const penal = await client.penalize(message.guild.id, üye.user.id, "JAIL", true, message.member.id, reason);
        
        const embed = new EmbedBuilder()
        .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`
        ${üye} (${üye.id}) üyesi sunucudan **${reason}** sebebiyle <t:${parseInt(Date.now() / 1000)}:F> tarihinde **jaillendi**. Ceza numarası : **#${penal.id}**`)
        .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor())
        await message.react(emojiler.onay)
        await message.reply({embeds : [embed]})
        await client.channels.cache.get(kanallar.cezaLog.JailLog).send({embeds : [embed]})
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.member.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
        await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $inc: { cezapuan: 20 } }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $push: { names: { name: üye.displayName, yetkili: message.author.id, rol: "Jail", date: Date.now() } } }, { upsert: true });
            
        const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: üye.user.id });
        if(kanallar.cezaLog.CezaPuan) 
        {
            message.guild.channels.cache.get(kanallar.cezaLog.CezaPuan)
            .send({ content:`${üye} üyesi **jail** cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
        }
    
    
    }
    }