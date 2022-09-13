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
        name: ["unban","yasaklakaldır"],
        desc: "Un-Ban",
        category: "Yetkili",
    },
    async run({ client, message, args }) {
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
        let muser = message.mentions.users.first();
        let userid;
        if(isNaN(args[0])){
        if(!muser){
            userid = userid;
        }
        else{userid = muser.id;}}
        else{userid = args[0];}
        if(!args[0]){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(cevap.cevaplar.NotMember)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }
        try{
        let üye = await client.users.fetch(userid);
            try{
         
                let banlımı = await message.guild.bans.fetch(userid);
                const data = await client.penalize(message.guild.id, üye.id, "BAN", true, message.author.id);
                if (data) {
                      data.active = false;
                      await data.save();
                    }
                    const embed = new EmbedBuilder()
                    .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
                    .setDescription(`<@!${üye.id}> kullanıcısının yasağı ${message.member} tarafından <t:${parseInt(Date.now() / 1000)}:R> önce yasağı kaldırıldı.`)
                    .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
                    .setColor(client.redColor())
                    await  message.reply({embeds : [embed]})
                    await client.channels.cache.get(kanallar.cezaLog.UnBanLog).send({embeds : [embed]})
                    message.guild.members.unban(args[0], `${message.author.username} tarafından kaldırıldı!`).catch(() => {});
                
   

            }catch(err) {
                const embed = new EmbedBuilder()
                .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
                .setDescription(`Bu kullanıcı yasaklı değil`)
                .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
                .setColor(client.redColor())
                await  message.reply({embeds : [embed]})
           
            }
        }catch(e){
            const embed = new EmbedBuilder()
            .setAuthor({name :  message.member.user.username , iconURL :  message.member.user.displayAvatarURL({dynamic: true , size : 4096})})
            .setDescription(`Böyle bir kullanıcı bulunamadı.`)
            .setFooter({text :  message.guild.name , iconURL :  message.guild.iconURL({dynamic: true , size : 4096})})
            .setColor(client.redColor())
            await  message.reply({embeds : [embed]})
            return
        }


      

        
    }}