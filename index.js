const { delData, setData, getById, insertData } = require('./database')
const { Database } = require('sqlite3')
const { Telegraf, Context } = require('telegraf')
const { delay } = require('bluebird')


let isWaiting1 = false
let isWaiting2 = false
let testDate

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

bot.on('message', (ctx)=>{
  console.log(ctx.message.from.username, ctx.message.from.username)
})


bot.command('alco', ()=>{  // команда, чтоб записать количество выпитого алко
  bot.reply('Вспомни наши 8 заповедей и назови ту, которой сегодня ты следовал, ах да вот же они: ')
  bot.reply(``)
})

bot.command('delete', (ctx)=>{
  delData(ctx.message.from.id)
})




bot.launch()