const { delData, setData, getById, insertData, updateData1, updateData2, updateData3, updateData4, delById } = require('./database')
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

bot.command('delete', ctx=>{
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
    if (text)
      ctx.reply(text)
    else
      ctx.reply("Дитя мое, тебе еще только предстоит познать этот мир...")
  })
})

bot.command('alco', ctx=>{  // команда, чтоб записать количество выпитого алко
  ctx.reply('Вспомни наши 8 заповедей и назови ту, которой сегодня ты следовал, ах да вот же они: ')
  ctx.reply(`1. пиво/сидр,
2. шейк/ром-кола/рево/подобное, 
3. водка,
4. ром,
5. егерь/крепкий ликер/джин/аристократическая хуйня, 
6. вино,
7. портвейн,
8. ликеры`)
  updateData1(ctx.message.from.id, new Date())
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
          tx.reply("Какой выдержки было твое пойло? Напиши значение в градусах.")
        }
        else
          delById(ctx.message.from.id, value.date)
        break

      case 1:
        updateData3(ctx.message.from.id, ctx.message.text, value.date)
        ctx.reply("Каким объемом выпитого ты нас порадуешь? Укажи значение в милилитрах.")
        break

      case 2:
        updateData4(ctx.message.from.id, ctx.message.text, value.date)
        ctx.reply("Дитя мое, ты не перестаешь меня радовать")
        data = data._rejectionHandler0
        let alco = JSON.parse(data.alco)

        alco[value.alco] += parseInt(ctx.message.text)/1000
        let etanol = data.count+parseInt(ctx.message.text)*value.gradus/100

        setData(ctx.message.from.id, etanol, JSON.stringify(alco), value.date, 0, null)
    }
  })
})

bot.launch()