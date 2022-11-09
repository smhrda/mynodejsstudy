const express = require('express'); // 설치한 익스프레스 가져오기
const app = express(); // 가져온 익스프레스 활성화

const router = require('./router/router.js'); // 경로별 기능 내용은 router.js로 분리해서 사용
const DBrouter = require('./router/DBrouter.js'); // DB관련 라우터
const EJSrouter = require('./router/EJSrouter.js');
const bodyparser = require('body-parser');
const Sessionrouter = require('./router/Sessionrouter.js');
const Messagerouter = require('./router/Messagerouter.js');

let ejs = require('ejs');

const session = require('express-session'); // 세션 기능 가져오기
const mysql_session = require('express-mysql-session'); // 세션이 저장되는 영역(mysql)

app.set("view engine", "ejs");

let conn = {
    host: "127.0.0.1",
    user: "root",
    password: "smhrd12",
    port: "3306",
    database: "nodejs_db"
}

let conn_session = new mysql_session(conn); // DB에 가서 연결 정보가 맞는지 확인하는 역할
app.use(session({
    secret : "smart",
    resave : false, // 매번 서버에 저장할 것인지 설정
    saveUninitialized : true, // 서버를 시작할 때마다 초기화할 것인지 설정
    store : conn_session // 저장 공간 지정
})); // 미들웨어로 session 기능 등록(저장위치 : mysql)


app.use(express.static("./public"));


// POST 방식일 때 body영역을 읽을 수 있게 해주는 미들웨어로 bodyparser 등록
// 라우터로 읽어들이기 전에 먼저 등록해줘야함!(순서 주의)
app.use(bodyparser.urlencoded({extended:false})); 

app.use(router); // 미들웨어 등록
app.use(DBrouter);
app.use(EJSrouter);
app.use(Sessionrouter);
app.use(Messagerouter);
app.listen(3001); // 현재 서버 파일의 port 번호 설정