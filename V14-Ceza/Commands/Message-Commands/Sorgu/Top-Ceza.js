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
        name: ["top-ceza","tceza", "topceza"],
        desc: "Top Ceza",
        category: "Yetkili",
    },
    async run({ client, message, args }) {

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
        let cezaTop = await ceza.find({ guildID: message.guild.id }).sort({ top: -1 });
    if (cezaTop.length === 0) 
    {
    message.react(emojiler.red)
    message.reply({ content:"Herhangi bir ceza verisi bulunamadı!"});
    return }
    cezaTop = cezaTop.filter((x) => message.guild.members.cache.has(x.userID));
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


    const denem = cezaTop.map((x, i) => `\`${i + 1}.\` <@${x.userID}>  \`(${x.userID})\` : **\`${x.top}\`**`).join("\n")
    
    const embed = new EmbedBuilder()
    .setDescription(`${denem}`)
    .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
    .setThumbnail(message.guild.iconURL({dynamic : true , size : 4096}))
    if(cezaTop.length <= 10){
    row.components[0].setDisabled(true) 
    row.components[1].setDisabled(true) 
    row.components[2].setDisabled(true) 
    message.reply({ embeds: [embed], components : [row] });
    }else {
        const msg = await message.reply({embeds : [embed],components: [row]})
    

    let page = 1;
    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
   
    collector.on("collect", async (button) => {
        if (cezaTop.length > 10) {

            if(button.customId === ileri) {
            await button.deferUpdate();
            if (cezaTop.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
            page += 1;
            let isimVeri = cezaTop.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
            msg.edit({ embeds: [new EmbedBuilder()
                .setDescription(`${isimVeri}`)
                .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
                .setThumbnail(message.guild.iconURL({dynamic : true , size : 4096}))
            ]
        })
    }
    if(button.customId === geri) {
        await button.deferUpdate();
        if (cezaTop.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
        page -= 1;
        let isimVeri = cezaTop.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");

        msg.edit({ embeds: [new EmbedBuilder()
            .setDescription(`${isimVeri}`)
            .setFooter({text: message.guild.name , iconURL : message.guild.iconURL({dynamic : true , size : 4096})})
            .setThumbnail(message.guild.iconURL({dynamic : true , size : 4096}))
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
    }
    }