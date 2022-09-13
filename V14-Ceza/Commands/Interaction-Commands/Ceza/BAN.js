const { SlashCommandBuilder,AttachmentBuilder, EmbedBuilder,ActionRowBuilder, PermissionsBitField,ButtonBuilder} = require("discord.js");
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

const ms = require("ms")
const registerData  = require("../../../schemas/registerStats");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDMPermission(false)
        .setDescription("Bir Kullanıcıyı Sunucudan Yasaklarsınız.")
        .addUserOption((option) =>
        option.setName("kişi")
          .setDescription("Bir üye belirtebilirsiniz.")
          .setRequired(true),
      )
      .addStringOption((option) =>
      option.setName("sebep")
        .setDescription("Bir Sebep Belirtin.")
        .setRequired(true)
    ),
    
        
    async run(interaction) {
        if(!interaction.member.roles.cache.has(rol.roller.BanPerm) && !interaction.member.roles.cache.has(rol.roller.Owner) && !interaction.member.roles.cache.has(rol.roller.Owner2) && !interaction.member.roles.cache.has(rol.roller.ChatMute) && !interaction.member.roles.cache.has(rol.roller.PANKART) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) { return interaction.reply({embeds : [ new EmbedBuilder().setAuthor({name : interaction.member.user.username , iconURL : interaction.member.user.displayAvatarURL({dynamic :  true , size : 4096})}).setDescription(cevap.cevaplar.NotPerm).setColor(client.redColor())], ephemeral: true })}
        var üye = interaction.options.getMember("kişi") 
        var reason = interaction.options.getString("sebep") 
        if(üye === null)
        { 
            const embed = new EmbedBuilder()
        .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`Kullanıcı Sunucuda Bulunamadı.`)
        .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor()) 
        await interaction.reply({embeds : [embed],ephemeral : true})
        return
    }
        if(üye.id === interaction.member.id){ 
            const embed = new EmbedBuilder()
            .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kendini jailleyemezsin`).setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor()) 
            await interaction.reply({embeds : [embed],ephemeral : true})
        return}
       
        if(interaction.member.roles.highest.position <= üye.roles.highest.position){
            const embed = new EmbedBuilder()
            .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kullanıcısı sizle aynı yada üst pozisyonda olduğundan dolayı kullanıcıyı yasaklıyamazsınız.`)
            .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  interaction.reply({embeds : [embed], ephemeral : true})
            return
            }
        if(üye.bannable === false){
            const embed = new EmbedBuilder()
            .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} Kullanıcısını sunucudan yasaklıyamazsınız.`)
            .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  interaction.reply({embeds : [embed] , ephemeral : true})
            return
        }
        üye.ban({ reason: `${reason} ' Yetkili: ${interaction.member.user.tag}` , deleteMessageDays: 1}).catch(() => {});
        if (settings.dmMessages === true){
            üye.send({ content:`**${interaction.guild.name}** sunucusundan, **${interaction.member.user.tag}** tarafından, **${reason}** sebebiyle banlandınız!`}).catch(() => {})
        }
        const penal = await client.penalize(interaction.guild.id, üye.id, "BAN", true, interaction.member.id, reason);
        const embed = new EmbedBuilder()
        .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`
        ${üye} (${üye.id}) üyesi sunucudan **${reason}** sebebiyle <t:${parseInt(Date.now() / 1000)}:F> tarihinde **yasaklandı**. Ceza numarası : **#${penal.id}**`)
        .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor())
        await interaction.reply({embeds : [embed]})
        await client.channels.cache.get(kanallar.cezaLog.BanLog).send({embeds : [embed]})
        await ceza.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
        await cezapuan.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });
        await isimler.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $push: { names: { name: üye.displayName, yetkili: interaction.member.id, rol: "Ban", date: Date.now() } } }, { upsert: true });
        
        const cezapuanData = await cezapuan.findOne({ guildID: interaction.guild.id, userID: üye.user.id });
        if(kanallar.cezaLog.CezaPuan) 
        {
            interaction.guild.channels.cache.get(kanallar.cezaLog.CezaPuan)
            .send({ content:`${üye} üyesi **ban** cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})
        }
    }}