const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./data.db", err=>{
    if (err) console.log("Ебать, ложись! Ошибка вылетела, щас бомбить начнут. " + err.message)
    else console.log("Мы подключились к этой сучке!")
})

function insertData(id, count=0, alco=null, date=null, score=0, task=null){
    db.run('INSERT INTO alcodata(id, count, alco, date, score, task) VALUES (?, ?, ?, ?, ?, ?)', [id, count, alco, date, score, task], err => {
        if (err) console.log("У тебя член маленький" + err.message)
        else console.log("Вставил ты ей хорошеично")
    })
}

function delData(id){
    db.run("DELETE FROM alcodata where id == (?)", [id], err=>{
        if (err) console.log("Шеф, вы проебались конкретно " + err.message)
        else console.log("Эта хуйня улетела от сюда")
    })
}

function getData(id){
    const res = db.get("SELECT * FROM alcodata where id == (?)", [id], function(err, row){
    
    })
}

function setData(id, count, alco, date, score, task=undefined){
    if (task != undefined)
        db.run("UPDATE alcodata SET count = ?, alco = ?, date = ?, score = ?, task = ? WHERE id = ?", [count, alco, date, score, task, id])
    else
        db.run("UPDATE alcodata SET count = ?, alco = ?, date = ?, score = ? WHERE id = ?", [count, alco, date, score, id])
}

const writeData = function( id ){
    return new Promise( async (resolve, reject)=> {
        const res = db.get("SELECT * FROM alcodata where id == (?)", [id], function(err, row){
            if( !err ){
                resolve( row ) 
            }else{
                resolve(false) 
            }
        })
    })
}
 



// db.run("CREATE TABLE alcodata(id integer not null, count integer not null, alco text not null, date text, score integer, task text)")
// db.run("DELETE TABLE alcodata")


module.exports.insertData = insertData
module.exports.delData = delData
module.exports.getData = getData
module.exports.setData = setData
module.exports.writeData = writeData