const { delData, setData, getById, insertData, updateData1, updateData2, updateData3, updateData4, delById, getByUser } = require('./database')
const { Telegraf, Context } = require('telegraf')
const { delay } = require('bluebird')

let alcoObj = {
  1: 'пиво/сидр',
  2: 'шейк/ром-кола/рево/подобное', 
  3: 'водка',
  4: 'ром',
  5: 'егерь/крепкий ликер/джин/аристократическая хуйня', 
  6: 'вино',
  7: 'портвейн',
  8: 'ликеры'
}

const bot = new Telegraf("5290656003:AAHs-MnL_wUOwDh18i-xgfxUx-JdPxSZ30c")
bot.start( async ctx=>{
  if (await ctx.getChatMembersCount(ctx.chat.id) > 2) {
    ctx.reply(`Здравствуйте, мои дети! Мы приветствуем вас в секте "Свидетели Разлива Пива"`)
    ctx.reply('Если ты хочешь стать полноправным членом нашего культа тебе всего лишь нужно ввести команду /cum_in')
  }
  else { 
    ctx.reply(`Здравствуй, последователь ${ctx.chat.first_name}! Мы рады видеть тебя в секте "Свидетели Разлива Пива"`)
    insertData(ctx.message.from.id, ctx.message.from.username)
  }
})

bot.command('cumin', ctx=>{
  if (ctx.message.from.username != "fuckingburner" || ctx.message.from.username != "fuckinburner")
    ctx.reply(`${ctx.message.from.first_name}, мы рады видеть тебя в свой секте "Свидетели Разлива Пива"`)
  else
    ctx.reply(`${ctx.message.from.first_name}, мы не рады видеть тебя в свой секте "Свидетели Разлива Пива", но хуй с тобой - присоединяйся`)
  insertData(ctx.message.from.id, ctx.message.from.username)
})

bot.command('cumout', ctx=>{
  delData(ctx.message.from.id)
  delData(ctx.message.from.id, "tempData")
  ctx.reply("Жаль, что ты оказался слишком слабым...")
})

bot.command('myalco', ctx=>{  // команда, чтоб 
  let data = getById(ctx.message.from.id)
  data.then(()=>{
    data = data._rejectionHandler0
    let alco = JSON.parse(data.alco)
    let text = 'Вот твой почетный список:\n'
    for (k in alco){
      if (alco[k] != 0)
        text += `${k} : ${alco[k]} л; \n`
    }
    if (text) {
      text += `\nТы выпил ${parseFloat(data.count.toFixed(2))} мл. этанола`
      ctx.reply(text)
    }
    else
      ctx.reply("Дитя мое, тебе еще только предстоит познать этот мир...")
  })
})

bot.command('alcof', ctx=>{
  let text = ctx.message.text.split(' ')[1]
  if (text){
    if (text[0] == '@')
      text = text.slice(1)
    let value = getByUser(text)
    value.then(()=>{
      value = value._rejectionHandler0
      if (value){
        let alco = JSON.parse(value.alco)
        text = 'Почетный список твоего собрата:\n'
        for (k in alco){
          if (alco[k] != 0)
            text += `${k} : ${alco[k]} л; \n`
        }
        if (text) {
          text += `\nТвой собрат выпил ${parseFloat(value.count.toFixed(2))} мл. этанола`
          ctx.reply(text)
        }
        else
          ctx.reply('Твоему собрату еще только предстоит познать этот мир. Помоги сделать ему этот нелегкий шаг. Обсуди с ним, насколько вы сильно любите нашу секту за чашечкой водки')
      }
      else
      ctx.reply('Твоему собрату еще только предстоит познать этот мир. Помоги сделать ему этот нелегкий шаг. Пригласи его в нашу секту и помоги ему тут обосновоться')
    })
  }
  else
  ctx.reply('Из-за таких, как ты, нашу веру ущемляют')
})

bot.command('time', ctx=>{
  let value = getById(ctx.message.from.id)
  value.then(()=>{
    value = value._rejectionHandler0
    const date = new Date(parseInt(value.date))
  })
})

bot.command('alco', ctx=>{  // команда, чтоб записать количество выпитого алко
  updateData1(ctx.message.from.id, new Date())
  ctx.telegram.sendMessage(ctx.chat.id, 
  `Вспомни наши 8 заповедей и назови ту, которой сегодня ты следовал, ах да вот же они:\n
  1. пиво/сидр,
  2. шейк/ром-кола/рево/подобное, 
  3. водка,
  4. ром,
  5. егерь/крепкий ликер/джин/аристократическая хуйня, 
  6. вино,
  7. портвейн,
  8. ликеры`, {
    reply_markup: { inline_keyboard: [[{text: "Отмена", callback_data: "cancel"}]]}
  })
})

bot.on('message', ctx=>{
  let data = getById(ctx.message.from.id)  // данные с таблицы alcoData
  let value = getById(ctx.message.from.id, "tempData", "date")  // данные с таблицы tempData
  value.then(()=> {
    value = value._rejectionHandler0
    switch (value.stage){  // этап
      case 0:
        if (ctx.message.text in alcoObj){
          updateData2(ctx.message.from.id, alcoObj[ctx.message.text], value.date)
          ctx.telegram.sendMessage(ctx.chat.id, 'Какой выдержки было твое пойло? Напиши значение в градусах.', {
              reply_markup: { inline_keyboard: [[{text: "Отмена", callback_data: "cancel"}]]}
          })
        }
        else
          delById(ctx.message.from.id, value.date)
        ctx.deleteMessage(ctx.message.message_id-1)
        ctx.deleteMessage()
        break
      case 1:
        if (parseInt(ctx.message.text) <= 100 && parseInt(ctx.message.text) > 0) {
          updateData3(ctx.message.from.id, ctx.message.text, value.date)
          ctx.telegram.sendMessage(ctx.chat.id, 'Каким объемом выпитого ты нас порадуешь? Укажи значение в милилитрах.', {
            reply_markup: { inline_keyboard: [[{text: "Отмена", callback_data: "cancel"}]]}
          })
        }
        else {
          ctx.telegram.sendMessage(ctx.chat.id, 'Введи нормально, пожалуйста. Глупые в нашей секте долго не держатся. И все же, сколько градусов?', {
            reply_markup: { inline_keyboard: [[{text: "Отмена", callback_data: "cancel"}]]}
          })
        }
        ctx.deleteMessage(ctx.message.message_id-1)
        ctx.deleteMessage()
        break

      case 2:
        if (parseInt(ctx.message.text) <= 10000 && parseInt(ctx.message.text) > 0) {
          updateData4(ctx.message.from.id, ctx.message.text, value.date)
          data = data._rejectionHandler0
          let alco = JSON.parse(data.alco)

          alco[value.alco] += parseInt(ctx.message.text)/1000
          let etanol = parseInt(ctx.message.text)*value.gradus/100

          setData(ctx.message.from.id, data.count + etanol, JSON.stringify(alco), value.date, 0, null)
          ctx.reply('Дитя мое, ты не перестаешь меня радовать')
          ctx.reply(`Твой сегодняшний вклад: ${value.alco}: ${parseInt(ctx.message.text)/1000} л. или ${etanol} мл. этанола`)
        }
        else {
          ctx.telegram.sendMessage(ctx.chat.id, 'Введи нормально, пожалуйста. Глупые в нашей секте долго не держатся. И все же, сколько милилитров?', {
            reply_markup: { inline_keyboard: [[{text: "Отмена", callback_data: "cancel"}]]}
          })
        }
        ctx.deleteMessage(ctx.message.message_id-1)
        ctx.deleteMessage(ctx.message.message_id)
    }
  })
})

bot.action('cancel', ctx=>{
  let value = getById(ctx.from.id, "tempData", "date")
  value.then(()=>{
    delById(ctx.from.id, value._rejectionHandler0.date)
    ctx.deleteMessage()
  })
})

bot.launch()