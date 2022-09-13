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
        name: ["unmute","mutekaldır"],
        desc: "Un-Mute",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!message.member.roles.cache.has(rol.roller.ChatMute) && !message.member.roles.cache.has(rol.roller.Owner) && !message.member.roles.cache.has(rol.roller.Owner2) && !message.member.roles.cache.has(rol.roller.Ceo) && !message.member.roles.cache.has(rol.roller.PANKART) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)){  
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
        const data = await penals.findOne({ userID: üye.user.id, guildID: message.guild.id, $or: [{ type: "CHAT-MUTE" }, { type: "VOICE-MUTE" }], active: true });
        if(data === null && !üye.roles.cache.has(rol.roller.ChatMuteRole) && !üye.roles.cache.has(rol.roller.VoiceMuteRole)){
                const embed = new EmbedBuilder() 
                    .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                    .setDescription(`Kullanıcının herhangi bir aktif bir **CHAT-MUTE, VOICE-MUTE** cezası bulunamadı.`)
                    .setColor(client.redColor())
                    .setFooter({text : message.guild.name})
                    message.reply({embeds : [embed]})
                    return
        }

        var ChatMute = randomstring({length: 20});
        var VoiceMute = randomstring({length: 20});
        var Unİptal = randomstring({length: 20});
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(ChatMute)
            .setEmoji(emojiler.chatmute)
            .setLabel("Chat-Mute")
            .setStyle(3)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId(VoiceMute)
            .setEmoji(emojiler.voicemute)
            .setLabel("Voice-Mute")
            .setStyle(3)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId(Unİptal)
            .setEmoji(emojiler.red)
            .setLabel("İptal")
            .setStyle(4)
        )
        const embed = new EmbedBuilder() 
                .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                .setDescription(`Kullanıcısının hangi cezasını kaldırmak istediği alt taraftan seç.`)
                .setColor(client.redColor())
                .setFooter({text : message.guild.name})
               

        const msg = await message.reply({embeds : [embed] , components :[row]})
        var filter = (button) => button.user.id === message.member.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 20000 })
       
        collector.on("collect", async (button) => {
            if(button.customId === ChatMute) {
            const kontrol = await penals.findOne({ userID: üye.user.id, guildID: message.guild.id, $or: [{ type: "CHAT-MUTE" }], active: true });
            if(kontrol === null && !üye.roles.cache.has(rol.roller.ChatMute))
            {
                const embed = new EmbedBuilder() 
                .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                .setDescription(cevap.cevaplar.NotFoundMute)
                .setColor(client.redColor())
                .setFooter({text : message.guild.name})
                button.reply({embeds : [embed]})

                row.components[0].setDisabled(true)
                await msg.edit({components : [row]})

            }else {
                row.components[0].setDisabled(true)
                await msg.edit({components : [row]})

                if(üye.roles.cache.has(rol.roller.ChatMuteRole)) 
                {await üye.roles.remove(rol.roller.ChatMuteRole)}
       
                if (kontrol) {
                    kontrol.active = false;
                    await kontrol.save();
                  }
                  const embed = new EmbedBuilder() 
                  .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                  .setDescription(`${üye} Kullanıcının **CHAT-MUTE** cezası başarıyla kaldırıldı. \n Kaldırılma Zamanı : <t:${parseInt(Date.now() / 1000)}:F>`)
                  .setColor(client.greenColor())
                  .setThumbnail(üye.displayAvatarURL({dynamic : true , size : 4096}))
                  .setFooter({text : message.guild.name})
                  await button.reply({embeds : [embed]})

                  const embeds = new EmbedBuilder() 
                  .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                  .setDescription(`
                  ${üye} Kullanıcısının **CHAT-MUTE** cezası kaldırıldı.
                  Cezayı Kaldıran Yetkili : ${message.member}
                  Cezanın Kaldırılma Tarihi : <t:${parseInt(Date.now() / 1000)}:F>
                  `)
                  .setColor(client.redColor())
                  .setFooter({text : message.guild.name})
                  .setThumbnail(üye.displayAvatarURL({dynamic : true , size : 4096}))
                  await message.guild.channels.cache.get(kanallar.cezaLog.ChatMuteLog).send({embeds : [embeds]})
            
                  if (settings.dmMessages === true){
                    üye.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **CHAT-MUTE** cezan kaldırıldı.`}).catch(() => {})
                }
            }

            }
            if(button.customId === VoiceMute) {
                const kontrol = await penals.findOne({ userID: üye.user.id, guildID: message.guild.id, $or: [{ type: "VOICE-MUTE" }], active: true });
                if(kontrol === null && !üye.roles.cache.has(rol.roller.VoiceMuteRole))
                {
                    const embed = new EmbedBuilder() 
                    .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                    .setDescription(cevap.cevaplar.NotFoundVoıceMute)
                    .setColor(client.redColor())
                    .setFooter({text : message.guild.name})
                    button.reply({embeds : [embed]})
    
                    row.components[1].setDisabled(true)
                    await msg.edit({components : [row]})
    
                }else {
                    row.components[1].setDisabled(true)
                    await msg.edit({components : [row]})
                    
                    if(üye.roles.cache.has(rol.roller.VoiceMuteRole)) 
                    {await üye.roles.remove(rol.roller.VoiceMuteRole)}
           
                    if (kontrol) {
                        kontrol.active = false;
                        await kontrol.save();
                      }
                      const embed = new EmbedBuilder() 
                      .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                      .setDescription(`${üye} Kullanıcının **VOICE-MUTE** cezası başarıyla kaldırıldı. \n Kaldırılma Zamanı : <t:${parseInt(Date.now() / 1000)}:F>`)
                      .setColor(client.greenColor())
                      .setThumbnail(üye.displayAvatarURL({dynamic : true , size : 4096}))
                      .setFooter({text : message.guild.name})
                      await button.reply({embeds : [embed]})
    
                      const embeds = new EmbedBuilder() 
                      .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                      .setDescription(`
                      ${üye} Kullanıcısının **VOICE-MUTE** cezası kaldırıldı.
                      Cezayı Kaldıran Yetkili : ${message.member}
                      Cezanın Kaldırılma Tarihi : <t:${parseInt(Date.now() / 1000)}:F>
                      `)
                      .setColor(client.redColor())
                      .setFooter({text : message.guild.name})
                      .setThumbnail(üye.displayAvatarURL({dynamic : true , size : 4096}))
                      await message.guild.channels.cache.get(kanallar.cezaLog.VoiceMuteLog).send({embeds : [embeds]})
                
                      if (settings.dmMessages === true){
                        üye.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **CHAT-MUTE** cezan kaldırıldı.`}).catch(() => {})
                    }
                }
    
                }
                if(button.customId === Unİptal) {
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    row.components[2].setDisabled(true)
                    await msg.edit({components : [row]})

                    const embed = new EmbedBuilder() 
                    .setAuthor({name : message.member.user.username , iconURL : message.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
                    .setDescription(`İşlem başarıyla iptal edildi.`)
                    .setColor(client.greenColor())
                    .setFooter({text : message.guild.name})
                    await button.reply({embeds : [embed]})

                }
        })

    }}