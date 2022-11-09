const express = require('express');
const Sessionrouter = express.Router();

Sessionrouter.get('/sessionCreate', (req, res) => {
    // session 생성
    req.session.user = {
        "id":"smart",
        "pw":"123",
        "nick":"smart"
    }

    res.end(); // 끝내는 코드를 써야 세션이 제대로 생성됨!
})

Sessionrouter.get('/sessionSelect', (req, res) => {
    // session 검색
    console.log("session에 있는 user값 : " + req.session.user);
})

Sessionrouter.get('/sessionDelete', (req, res) => {
    // session 삭제
    delete req.session.user;

    res.end();
})






module.exports = Sessionrouter;