let config = require("./roller")
let settings = require("./settings")
module.exports = {
    cevaplar : {
      "TagNotFound":`Sunucuda şuanda taglı alım açık kullanıcı <@&${config.roller.VipRole}>,<@&${config.roller.BoosterRole}> rollerinden harhangi birine sahip olmalıdır yada kullanıcı isminde \`${settings.tag}\` bulunmalıdır.`,
      "NotVoiceChannel" : `Bir ses kanalında bulunman gerek.`,
      "MemberNotVoiceChannel" : `Etiketlenen üye sesli kanalda değil.`,
      "SameVoiceChannel":"Zaten aynı kanaldasınız.",
      "NotMember":`Bir kullanıcı etiketle @undefinable/id.`,
      "NotNameAndAge":`Bir isim yaş belirtmelisin @undefinable/id isim yaş`,
      "YouYou":`Kendini işlem yapamazsın.`,
      "Manageable":`Bu kullanıcıya işlem yapamıyorum.`,
      "Highest":`Bu kullanıcı senden yüksekte yada eşit.`,
      "NotRegPerm":`Kayıt komutunu kullanmak için <@&${config.roller.RegPerm}> rolüne sahip olmalısın.`,
      "NotPerm":`Bu komutu kullanmak için yetkin yetersiz.`,
      "NotFoundJail": `Kullanıcının üzerinde <@&${config.roller.JailRole}> rolü yok ve datada aktif bir jail cezası yok.`,
      "UnJail" : `Kullanıcının jail cezası başarıyla kaldırıldı.` ,
      "NotFoundMute": `Kullanıcının üzerinde <@&${config.roller.ChatMuteRole}> rolü yok ve datada aktif bir chat mute cezası yok.`,
      "NotFoundVoıceMute": `Kullanıcının üzerinde <@&${config.roller.VoiceMuteRole}> rolü yok ve datada aktif bir voice mute cezası yok.`,
  
    },
    
}