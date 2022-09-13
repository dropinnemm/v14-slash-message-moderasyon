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
const penals = require("../../../schemas/penals")
const ms = require("ms")
const registerData  = require("../../../schemas/registerStats");
module.exports = {
        data: new SlashCommandBuilder()
        .setName('voicemute')
        .setDMPermission(false)
        .setDescription("Bir Kullanıcıyı Süreli Olarak Sesli Kanallarında Mutelersiniz..")
        .addUserOption((option) =>
        option.setName("kişi")
        .setDescription("Bir üye belirtebilirsiniz.")
        .setRequired(true),)
        .addStringOption((option) =>
        option.setName("sebep")
        .setDescription("Bir Sebep Belirtin.")
        .setRequired(true)
        .addChoices(
        { name: 'DM Yoluyla Gönderilen Reklam.', value: 'DM Yoluyla Gönderilen Reklam' },
        { name: 'DM Yoluyla Gönderilen Ağır Küfürler.', value: 'DM Yoluyla Gönderilen Ağır Küfürler' },
        { name: 'DM Yoluyla Gönderilen Hakaretler.', value: 'DM Yoluyla Gönderilen Hakaretler' },
        { name: 'Chat/Voice Kanallarında Bulunan Kişilere Reklam.', value: 'Chat Kanallarında Bulunan Kişilere Reklam' },
        { name: 'Chat/Voice/DM Yoluyla Gönderilen Sunucuyu Kötülemek Amaçlı Mesajlar.', value: 'Chat/Voice/DM Yoluyla Gönderilen Sunucuyu Kötülemek Amaçlı Mesajlar' },
        { name: 'Dini ve Milli Değerlere Saygısızlık.', value: 'Dini ve Milli Değerlere Saygısızlık' },
        { name: 'Sunucu İçerisinde Kara Mizah Yapmak.', value: 'Sunucu İçerisinde Kara Mizah Yapmak' },
        { name: 'Uyarıya Rağmen Rahatsızlık Vermeye Devam Etmek.', value: 'Uyarıya Rağmen Rahatsızlık Vermeye Devam Etmek' },
        { name: 'Sunucuda Küfür Spam Flood Yapmak.', value: 'Sunucuda Küfür Spam Flood Yapmak' },
        { name: 'Sunucuda Kişisel Küfür Etmek.', value: 'Sunucuda Kişisel Küfür Etmek' },
        { name: 'Kayıt Odalarını Trollemek.', value: 'Kayıt Odalarını Trolleme' },
        { name: 'Kişilerin Özel Bilgilerini Paylaşmak.', value: 'Kişilerin Özel Bilgilerini Paylaşmak' },
        { name: 'Gereksiz Yere ROL/KİŞİ Etiketlemek.', value: 'Gereksiz Yere ROL/KİŞİ Etiketlemek' },
        { name: 'Yasal Olmayan Konuları Sunucuya Yansıtmak.', value: 'Yasal Olmayan Konuları Sunucuya Yansıtmak' },
        { name: 'Rahatsız Edici Sesler Çıkartmak.', value: 'Rahatsız Edici Sesler Çıkartmak' },
        { name: 'Sunucuda Bulunan/Bulunmayan Üyeleri Küçük Düşürmek.', value: 'Sunucuda Bulunan/Bulunmayan Üyeleri Küçük Düşürmek' },
        { name: 'Pornografig GİF/FOTOĞRAF/EMOJİ Göndermek.', value: 'Pornografig GİF/FOTOĞRAF/EMOJİ Göndermek' },
        { name: 'Epiletik GİF/FOTOĞRAF/EMOJİ Göndermek.', value: 'Epiletik GİF/FOTOĞRAF/EMOJİ Göndermek' },
        { name: 'Sadistlik İçeren GİF/FOTOĞRAF/EMOJİ Göndermek.', value: 'Sadistlik İçeren GİF/FOTOĞRAF/EMOJİ Göndermek' },
        { name: 'Soundpad, Bass Gibi Programlar Kullanmak.', value: 'Soundpad, Bass Gibi Programlar Kullanmak' },
        { name: 'Dozunu Çıkartarak Troll Yapmak.', value: 'Dozunu Çıkartarak Troll Yapmak' },
        { name: 'Burada Bulunmayan Nedenlerden Dolayı Jaillemek (Lütfen Daha Sonra Bildirin).', value: 'Menüde Bulunmayan Nedenlerden Dolayı' },))
        .addStringOption((option) =>
        option.setName("süre")
        .setDescription("1m : 1 dakika 1h : 1 saat 1d : 1 gün, 1w : 1 hafta")
        .setRequired(true),),
        
        
        async run(interaction) {
        if(!interaction.member.roles.cache.has(rol.roller.VoiceMute) && !interaction.member.roles.cache.has(rol.roller.Owner) && !interaction.member.roles.cache.has(rol.roller.Owner2) && !interaction.member.roles.cache.has(rol.roller.VoiceMute) && !interaction.member.roles.cache.has(rol.roller.PANKART) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) { return interaction.reply({embeds : [ new EmbedBuilder().setAuthor({name : interaction.member.user.username , iconURL : interaction.member.user.displayAvatarURL({dynamic :  true , size : 4096})}).setDescription(cevap.cevaplar.NotPerm).setColor(client.redColor())], ephemeral: true })}
        var üye = interaction.options.getMember("kişi") 
        var reason = interaction.options.getString("sebep") 
        var süre = interaction.options.getString("süre") 
        const duration = süre ? ms(süre) : undefined;
        if(üye === null){ 
        const embed = new EmbedBuilder()
        .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`Kullanıcı sunucuda bulunamadı.`)
        .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor()) 
        await interaction.reply({embeds : [embed],ephemeral : true})
        return
        }
        
        if(üye.id === interaction.member.id){ const embed = new EmbedBuilder().setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})}).setDescription(`${üye} Kendini jailleyemezsin`).setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})}).setColor(client.redColor()) 
        await interaction.reply({embeds : [embed], ephemeral : true})
        return
        }
        const data = await penals.findOne({ userID: üye.id, guildID: interaction.guild.id, $or: [{ type: "VOICE-MUTE" }], active: true });
        if(üye.roles.cache.has(rol.roller.VoiceMuteRole) || data ){ 
        const embed = new EmbedBuilder().setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})}).setDescription(`${üye} Kullanıcısının aktif **VOICE-MUTE** cezası bulunmakta.`).setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})}).setColor(client.redColor()) 
        await interaction.reply({embeds : [embed], ephemeral : true})
        return
        }
        
        if(interaction.member.roles.highest.position <= üye.roles.highest.position){const embed = new EmbedBuilder().setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})}).setDescription(`${üye} Kullanıcısı sizle aynı yada üst pozisyonda olduğundan dolayı kullanıcıyı cezalandıramazsınız.`).setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})}).setColor(client.redColor())
        await  interaction.reply({embeds : [embed], ephemeral : true})
        return
        }

        if(üye.manageable === false){ const embed = new EmbedBuilder().setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})}).setDescription(`${üye} Kullanıcısını sunucudan yasaklıyamazsınız.`).setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})}).setColor(client.redColor()) 
        await interaction.reply({embeds : [embed], ephemeral : true})
        return
        }

        if(!duration){ 
        const embed = new EmbedBuilder()
        .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`
        Geçerli bir zaman türü girmelisin. 
        1m : 1 dakika
        1h : 1 saat, 
        1d : 1 gün, 
        1w : 1 hafta`)
        .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})}).setColor(client.redColor()) 
        await interaction.reply({embeds : [embed] , ephemeral : true})
        return
        }

        await üye.roles.add(roller.roller.VoiceMuteRole)
        const penal = await client.penalize(interaction.guild.id, üye.user.id, "VOICE-MUTE", true, interaction.member.id, reason, true, Date.now() + duration);
        const time = ms(duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye").replace("w", " hafta");
        if (settings.dmMessages === true){
        üye.send({ content:`**${interaction.guild.name}** sunucusundan, **${interaction.member.user.tag}** tarafından, **${reason}** sebebiyle, **${time}** boyunca **VOICE-MUTE** cezası aldınız. Ceza numarası : **#${penal.id}**`}).catch(() => {})
        }
          
        const embed = new EmbedBuilder()
        .setAuthor({name :  interaction.member.user.username , iconURL :  interaction.member.user.displayAvatarURL({dynamic: true , size : 4096})})
        .setDescription(`
        ${üye} (${üye.id}) üyesi sunucuda **${reason}** sebebiyle <t:${parseInt(Date.now() / 1000)}:F> tarihinde **${time}** boyunca **VOICE-MUTE** ceazası verildi. Ceza numarası : **#${penal.id}**`)
        .setFooter({text :  interaction.guild.name , iconURL :  interaction.guild.iconURL({dynamic: true , size : 4096})})
        .setColor(client.redColor())
        await interaction.reply({embeds : [embed]})
        await client.channels.cache.get(kanallar.cezaLog.JailLog).send({embeds : [embed]})
        await ceza.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $push: { ceza: 1 } }, { upsert: true });
        await ceza.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.member.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
        await ceza.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $inc: { top: 1 } }, { upsert: true });
        await cezapuan.findOneAndUpdate({ guildID: interaction.guild.id, userID: üye.user.id }, { $inc: { cezapuan: 20 } }, { upsert: true });   const cezapuanData = await cezapuan.findOne({ guildID: interaction.guild.id, userID: üye.user.id });    
        if(kanallar.cezaLog.CezaPuan) {interaction.guild.channels.cache.get(kanallar.cezaLog.CezaPuan).send({ content:`${üye} üyesi **VOICE-MUTE** cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`})}
    
    
    }}