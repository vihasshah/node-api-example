const mysql = require('mysql')

class DB {
    static getConnection(){
        let conn = mysql.createConnection({
            host:'localhost',
            user:'',
            password:'',
            database:'test'
        });

        conn.connect(function(err){
            if (err) throw err;
            console.log("Connected!");
        })
        return conn
    }
}

module.exports = DB