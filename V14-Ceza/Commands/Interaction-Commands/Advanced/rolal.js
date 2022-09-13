const { SlashCommandBuilder,AttachmentBuilder, EmbedBuilder,ActionRowBuilder, PermissionsBitField,ButtonBuilder,} = require("discord.js");
const randomstring = require("random-string")
const cevap = require("../../../Config/cevaplar")
const rol = require("../../../Config/roller")
const emojiler = require("../../../Config/emojiler")
const settings = require("../../../Config/settings")
module.exports = {
  data: new SlashCommandBuilder()
  .setName("rolal")
  .setDescription("Rol Al")
  .setDMPermission(false)
  .addUserOption((option) =>
    option.setName("kişi")
      .setDescription("Bir kişi belirtebilirsiniz.")
      
      .setRequired(true),
  )
  .addRoleOption((option) =>
    option.setName("rol")
      .setDescription("Bir rol belirtebilirsiniz.")
      .setRequired(true)
  ),
    async run(interaction) {
      if(!interaction.member.roles.cache.has(rol.roller.Owner) && !interaction.member.roles.cache.has(rol.roller.Owner2) && !interaction.member.roles.cache.has(rol.roller.Ceo) && !interaction.member.roles.cache.has(rol.roller.PANKART) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){  
        const embed = new EmbedBuilder() 
        .setAuthor({name : interaction.member.user.username , iconURL : interaction.member.user.displayAvatarURL({dynamic : true ,size : 4096})})
        .setDescription(cevap.cevaplar.NotPerm)
        .setColor(client.redColor())
        .setFooter({text : interaction.guild.name})
        interaction.reply({embeds : [embed] , ephemeral : true})
        return
      
      }
        var üye = interaction.options.getMember("kişi") 
        var role = interaction.options.getRole("rol");
      
        var onayla = randomstring({length: 21});
        var iptal = randomstring({length: 21});
     
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(onayla)
            .setEmoji(emojiler.onay)
            .setLabel("Onayla")
            .setStyle(3)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId(iptal)
            .setEmoji(emojiler.red)
            .setLabel("Reddet")
            .setStyle(4)
        )
        const rowonayla = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId(onayla)
          .setEmoji(emojiler.onay)
          .setLabel("Onayla")
          .setDisabled(true)
          .setStyle(3)
      )
        const rowiptal = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId(iptal)
          .setEmoji(emojiler.red)
          .setLabel("Reddet")
          .setDisabled(true)
          .setStyle(4)
      )

        const embed = new EmbedBuilder()
        .setAuthor({name : interaction.member.user.username ,  iconURL : interaction.member.user.displayAvatarURL({dynamic : true , size : 4096})})
        .setDescription(`${üye} Kullanıcısından ${role} rolünü almak istediğinizden emin misiniz?`)
        .setColor(client.redColor())
        .setFooter({text : interaction.guild.name ,iconURL : interaction.guild.iconURL({dynamic : true, size: 4096}) })
        .setThumbnail(interaction.guild.iconURL({dynamic : true, size: 4096})) 

        const msg = await interaction.reply({embeds : [embed] ,components : [row]})

        const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async button => {
            if (button.customId === onayla) {
             if(!üye.roles.cache.has(role.id)){
              const embed = new EmbedBuilder()
              .setAuthor({name : interaction.member.user.username ,  iconURL : interaction.member.user.displayAvatarURL({dynamic : true , size : 4096})})
              .setDescription(`${üye} Kullanıcısında ${role} rolü bulunamadı`)
              .setColor(role.color ? role.color : client.greenColor())
              .setFooter({text : interaction.guild.name ,iconURL : interaction.guild.iconURL({dynamic : true, size: 4096}) })
              await button.reply({embeds : [embed] , ephemeral :  true})
              await interaction.editReply({components : [rowiptal]})
            return 
            }
                const embed = new EmbedBuilder()
                .setAuthor({name : interaction.member.user.username ,  iconURL : interaction.member.user.displayAvatarURL({dynamic : true , size : 4096})})
                .setDescription(`${üye} Kullanıcısına ${role} rolü başarıyla verildi.`)
                .setColor(role.color ? role.color : client.greenColor())
                .setFooter({text : interaction.guild.name ,iconURL : interaction.guild.iconURL({dynamic : true, size: 4096}) })
                await button.reply({embeds : [embed] , ephemeral :  true})
                await üye.roles.remove(role)
                await interaction.editReply({components : [rowonayla]})
             
            }

              if (button.customId === iptal) {
                const embed = new EmbedBuilder()
                .setAuthor({name : interaction.member.user.username ,  iconURL : interaction.member.user.displayAvatarURL({dynamic : true , size : 4096})})
                .setDescription(`İşlem baraşıyla iptal edildi.`)
                .setColor(role.color ? role.color : client.greenColor())
                .setFooter({text : interaction.guild.name ,iconURL : interaction.guild.iconURL({dynamic : true, size: 4096}) })
                await button.reply({embeds : [embed] , ephemeral :  true})
                await üye.roles.add(role)
                await interaction.editReply({components : [rowiptal]})
       
              }})}}