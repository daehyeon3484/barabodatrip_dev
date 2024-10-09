const dotenv = require("dotenv");
dotenv.config({path: './.server.env'});
const log = require('../config/logger.js')
const db = {
    database : process.env.DB_DATABASE,
    // connnectionLimit : 10,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    password : process.env.DB_PASS
}
const dbPool = require('mysql').createPool(db)
let sql = require('../sql.js');
const fs = require('fs');
fs.watchFile('../sql.js', (curr,prev) => {
    console.log('sql 변경시 재시작 없이 반영되도록 함.');
    delete require.cache[require.resolve('../sql.js')];
    sql = require('../sql.js');
});

const req = {
    async db(alias, param = [], where = '') {
      return new Promise((resolve, reject) => 
      dbPool.query(sql[alias].query + where, param, (error, rows) => {
          log.info("param :", {param : param})
          console.log(sql[alias].query)
          console.log("param :", [alias,param])
          if (error) {
              if(error.code != 'ER_DUP_ENTRY')
                  console.log("error : ", error)
              resolve([
                  error
              ]);
          } else {
              resolve(rows) 
              // log.info("param : ", JSON.stringify(rows))
          } 
      }));
    }

}

module.exports = req;

