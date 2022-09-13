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
        name: ["sicil","cezageçmiş","geçmiş"],
        desc: "Sicil",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
        const üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!message.member.roles.cache.has(rol.roller.Owner) && !message.member.roles.cache.has(rol.roller.Owner2) && !message.member.roles.cache.has(rol.roller.Ceo) && !message.member.roles.cache.has(rol.roller.PANKART) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)){  
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
        let data = await penals.find({ guildID: message.guild.id, userID: üye.user.id, }).sort({ date: -1 });
        if(data.length === 0){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`${üye} kullanıcısının sicili temiz.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }
        message.react(emojiler.onay)
        var geri = randomstring({length: 20});
        var ileri = randomstring({length: 20});
        var iptal = randomstring({length: 20});

    const row = new ActionRowBuilder()
    .addComponents(
     new ButtonBuilder()
    .setCustomId(geri)
    .setLabel("Önceki Sayfa")
    .setStyle(3)
    .setEmoji("◀️"),
    
    new ButtonBuilder()
    .setCustomId(iptal)
    .setLabel("Kapat")
    .setStyle(4)
    .setEmoji(emojiler.red),
    
    new ButtonBuilder()
    .setCustomId(ileri)
    .setLabel("Sonraki Sayfa")
    .setStyle(3)
    .setEmoji("▶️"),
    
    );
    const cezapuanData = await cezapuan.findOne({ userID: üye.user.id });
    if(data.length <= 3){
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        row.components[2].setDisabled(true) 
        let i = 1;

        data = data.map((x) => `
        \`${i , i++}.\` Tarih : <t:${parseInt(x.date / 1000)}:F> 
         Yetkili : <@${x.staff}>
         Sebep : \`${x.reason}\` 
         Ceza tipi : **[${x.type}]**
         Cezanın bitme tarihi : ${x.finishDate ? x.active ? `<t:${parseInt(x.finishDate / 1000)}:F>` : `Bitmiş <t:${parseInt(x.finishDate / 1000)}:R>` : `**...**` }
         Ceza id : **#${x.id}**
         Ceza ${x.active ? `hâlâ aktif. ${emojiler.onay}` : `deaktif. ${emojiler.red}` }`)
        const embed = new EmbedBuilder()
        .setDescription(`\n ${data.slice(0,3).join("\n")}`)
        .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
        .setThumbnail(üye.user.displayAvatarURL({dynamic : true , size : 4096}))
        .setAuthor({name : `Toplam Ceza Puanı : ${cezapuanData ? cezapuanData.cezapuan : 0}`, iconURL : üye.user.displayAvatarURL({dynamic :  true, size : 4096})})
        .setColor(client.redColor())
        message.reply({ embeds: [embed], components : [row] });
        }else {
            let i = 1;
            data = data.map((x) => `
            \`${i , i++}.\` Tarih : <t:${parseInt(x.date / 1000)}:F> 
             Yetkili : <@${x.staff}>
             Sebep : \`${x.reason}\` 
             Ceza tipi : **[${x.type}]**
             Cezanın bitme tarihi : ${x.finishDate ? x.active ? `<t:${parseInt(x.finishDate / 1000)}:F>` : `Bitmiş <t:${parseInt(x.finishDate / 1000)}:R>` : `**...**` }
             Ceza id : **#${x.id}**
             Ceza ${x.active ? `hâlâ aktif. ${emojiler.onay}` : `deaktif. ${emojiler.red}` }`)
            const embed = new EmbedBuilder()
            .setDescription(`${data.slice(0,3).join("\n")}`)
            .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
            .setThumbnail(üye.user.displayAvatarURL({dynamic : true , size : 4096}))
            .setAuthor({name : `Toplam Ceza Puanı : ${cezapuanData ? cezapuanData.cezapuan : 0}`, iconURL : üye.user.displayAvatarURL({dynamic :  true, size : 4096})})
            .setColor(client.redColor())
            const msg = await message.reply({embeds : [embed],components: [row]})
    

            let page = 1;
            var filter = (button) => button.user.id === message.author.id;
            let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
           
            collector.on("collect", async (button) => {
                if (data.length > 3) {
        
                    if(button.customId === ileri) {
                    await button.deferUpdate();
                    if (data.slice((page + 1) * 3 - 3, (page + 1) * 3).length <= 0) return;
                    page += 1;
                    let isimVeri = data.slice(page == 1 ? 3 : page * 3 - 3, page * 3).join("\n");
                    msg.edit({ embeds: [new EmbedBuilder()
                        .setDescription(`${isimVeri}`)
                        .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
                        .setThumbnail(üye.user.displayAvatarURL({dynamic : true , size : 4096}))
                        .setAuthor({name : `Toplam Ceza Puanı : ${cezapuanData ? cezapuanData.cezapuan : 0}`, iconURL : üye.user.displayAvatarURL({dynamic :  true, size : 4096})})
                        .setColor(client.redColor())
                    ]
                })
            }
            if(button.customId === geri) {
                await button.deferUpdate();
                if (data.slice((page - 1) * 3 - 3, (page - 1) * 3).length <= 0) return;
                page -= 1;
                let isimVeri = data.slice(page == 1 ? 0 : page * 3 - 3, page * 3).join("\n");
        
                msg.edit({ embeds: [new EmbedBuilder()
                    .setDescription(`Toplam ceza Puanı : **\`${cezapuanData ? cezapuanData.cezapuan : 0}\`**\n ${isimVeri}`)
                    .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
                    .setThumbnail(üye.user.displayAvatarURL({dynamic : true , size : 4096}))
                    .setAuthor({name : `Toplam Ceza Puanı : ${cezapuanData ? cezapuanData.cezapuan : 0}`, iconURL : üye.user.displayAvatarURL({dynamic :  true, size : 4096})})   
                    .setColor(client.redColor())
                ]
            })
            }
        
            if(button.customId === iptal) {
                await button.deferUpdate();
                row.components[0].setDisabled(true) 
                row.components[1].setDisabled(true) 
                row.components[2].setDisabled(true) 
                await msg.edit({ components: [row] }); 
               
        }
            }})
        }
        
    }}