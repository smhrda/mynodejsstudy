const mysql = require('mysql');

// DB 정보를 넣는 변수 conn 
let conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "smhrd12",
    port: "3306",
    database: "nodejs_db"
});

module.exports = conn;