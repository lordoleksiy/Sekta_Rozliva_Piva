const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird')

// пример объекта
let alcoObj = {
    'пиво/сидр': 0,
    'шейк/ром-кола/рево/подобное':0, 
    'водка': 0,
    'ром': 0,
    'егерь/крепкий ликер/джин/аристократическая хуйня': 0, 
    'вино': 0,
    'портвейн': 0,
    'ликеры': 0
}

const db = new sqlite3.Database("./data.db", err=>{
    if (err) console.log("Ебать, ложись! Ошибка вылетела, щас бомбить начнут. " + err.message)
    else console.log("Мы подключились к этой сучке!")
})

// зарегистрировать пользователя, при вызове можно указывать только id
function insertData(id, username=null, count=0, alco=JSON.stringify(alcoObj), date=null, score=0, task=null){
    const value = getById(id)
    value.then(()=> {
        if (value._rejectionHandler0==undefined){
            db.run('INSERT INTO alcodata(id, count, alco, date, score, task, username) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, count, alco, date, score, task, username], err => {
                if (err) console.log("У тебя член маленький. " + err.message)
                else console.log("Вставил ты ей хорошеично. ")
            })      
        }
    })
}

// удалить пользователя
function delData(id, base='alcodata'){
    db.run(`DELETE FROM ${base} where id == (?)`, [id], err=>{
        if (err) console.log("Шеф, вы проебались конкретно " + err.message)
        else console.log("Эта хуйня улетела от сюда")
    })
}

// изменить данные у пользователя по id
function setData(id, count, alco, date, score, task=undefined){  // если у человка поменяется юзернейм то надо обновить данные
    if (task != undefined)
        db.run("UPDATE alcodata SET count = ?, alco = ?, date = ?, score = ?, task = ? WHERE id = ?", [count, alco, date, score, task, id])
    else
        db.run("UPDATE alcodata SET count = ?, alco = ?, date = ?, score = ? WHERE id = ?", [count, alco, date, score, id])
}

// получить данные пользователя по id
function getById(id, base="alcodata", order=null) {
    if (order){
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${base} where id == (?) ORDER BY ${order} DESC`, [id], (err, result) => {
                if (err) {
                console.log('Error running sql: ' + err.message)
                reject(err)
                } else resolve(result)
            })
            })
    }
    else{
        return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${base} where id == (?)`, [id], (err, result) => {
            if (err) {
            console.log('Error running sql: ' + err.message)
            reject(err)
            } else resolve(result)
        })
        })
    }
}


// db.run("CREATE TABLE alcodata(id integer not null, count integer not null, alco text not null, date text, score integer, task text, username text)")
// db.run("DELETE TABLE alcodata")

//                                  Вторая база данных:
// db.run("CREATE TABLE tempData(id integer not null, alco text, gradus integer, count integer, stage integer)")

// создать запись пользователя в tempData
function updateData1(id, date){
    db.run('INSERT INTO tempData(id, stage, date) VALUES (?, 0, ?)', [id, date], err => {
        if (err) console.log("У тебя член маленький. " + err.message)
        else console.log("Вставил ты ей хорошеично. ")
    })
    }
function updateData2(id, alco, date){
    db.run('UPDATE tempData SET alco = ?, stage = 1 WHERE (id = ?) AND (date = ?)', [alco, id, date], err => {
        if (err) console.log("У тебя член маленький. " + err.message)
        else console.log("Вставил ты ей хорошеично. ")
    })  
}
function updateData3(id, gradus, date){
    db.run('UPDATE tempData SET gradus = ?, stage = 2 WHERE (id = ?) AND (date = ?)', [gradus, id, date], err => {
        if (err) console.log("У тебя член маленький. " + err.message)
        else console.log("Вставил ты ей хорошеично. ")
    })
}
function updateData4(id, count, date){
    db.run('UPDATE tempData SET count = ?, stage = 2 WHERE (id = ?) AND (date = ?)', [count, id, date], err => {
        if (err) console.log("У тебя член маленький. " + err.message)
        else console.log("Вставил ты ей хорошеично. ")
    })
}

module.exports.insertData = insertData
module.exports.delData = delData
module.exports.setData = setData
module.exports.getById = getById
module.exports.updateData1 = updateData1
module.exports.updateData2 = updateData2
module.exports.updateData3 = updateData3
module.exports.updateData4 = updateData4
