const {red, green, blue,yellow} = require("chalk")
const {chalk} = require("chalk")
const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const { set } = require("mongoose");
const kanallar = require("../Config/kanallar");
const rol = require("../Config/roller");
const settings = require("../Config/settings");
const config = require('../Config/settings');
const penals = require("../schemas/penals")
const registerData  = require("../schemas/registerStats");
module.exports = async (client) => {
    client.on('ready', () => {
        console.log(yellow(`${client.user.username} Botu başarıyla aktif edildi.`))
        setInterval(() => {
        const oynuyor = config.botdurum;
        const index = Math.floor(Math.random() * (oynuyor.length));
        client.user.setPresence({activities: [{ name: oynuyor[index], type: 5  }],status: 'dnd'})
        },5000)
setInterval(async () => {  
  const guild = client.guilds.cache.get(settings.GuildId);
  if (!guild) return;
  const finishedPenals = await penals.find({ guildID: guild.id, active: true, temp: true, finishDate: { $lte: Date.now() } });
  finishedPenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE") {
      x.active = false;
      await x.save();
      await member.roles.remove(rol.roller.ChatMuteRole);
      client.channels.cache.get(kanallar.cezaLog.ChatMuteLog)
        .send({ embeds: 
        [new EmbedBuilder()
        .setColor(client.greenColor())
        .setDescription(`${member} kullanıcısının **CHAT-MUTE** cezasının süresi doldu`)
        .setAuthor({name : member.user.username , iconURL : member.user.displayAvatarURL({dynamic : true , size : 4096})})
    
    ]});
    }
    if (x.type === "TEMP-JAIL") {
      x.active = false;
      await x.save();
      await member.roles.set(rol.UnRegRoles)
      client.channels.cache.get(kanallar.cezaLog.JailLog)
      .send({ embeds: 
      [new EmbedBuilder()
      .setColor(client.greenColor())
      .setDescription(`${member} kullanıcısının **TEMP-JAİL** cezasının süresi doldu`)
      .setAuthor({name : member.user.username , iconURL : member.user.displayAvatarURL({dynamic : true , size : 4096})})
      ]})
    } 
    if (x.type === "VOICE-MUTE") {
        if (member.voice.channelId) {
            x.removed = true;
            await x.save();
            if (member.voice.serverMute) member.voice.setMute(false);
          }
          x.active = false;
          await x.save();
          member.roles.remove(rol.roller.VoiceMuteRole);
          client.channels.cache.get(kanallar.cezaLog.VoiceMuteLog)
          .send({ embeds: 
          [new EmbedBuilder()
          .setColor(client.greenColor())
          .setDescription(`${member} kullanıcısının **VOICE-MUTE** cezasının süresi doldu`)
          .setAuthor({name : member.user.username , iconURL : member.user.displayAvatarURL({dynamic : true , size : 4096})})
          ]})
    }
  });
  const activePenals = await penals.find({ guildID: guild.id, active: true });
  activePenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE" && !member.roles.cache.has(rol.roller.ChatMuteRole)) return member.roles.add(rol.roller.ChatMuteRole);
    if ((x.type === "JAIL" || x.type === "TEMP-JAIL") && !member.roles.cache.has(rol.roller.JailRole)) return member.setRoles(rol.roller.JailRole);
    if (x.type === "VOICE-MUTE") {
      if (!member.roles.cache.has(rol.roller.VoiceMuteRole)) member.roles.add(rol.roller.VoiceMuteRole);
      if (member.voice.channelId && !member.voice.serverMute) member.voice.setMute(true);
    }
  });

}, 750);


        })
      }
    
