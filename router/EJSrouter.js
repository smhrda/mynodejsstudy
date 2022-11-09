const express = require("express");
const EJSrouter = express.Router();    // express 갖고있는 기능중에 router기능을 사용

EJSrouter.get('/ejs01', (req, res) => {
    console.log('/ejs01 라우터 실행');

    res.render("ex01EJS", {
        name1 : "value1",
        name2 : "value2"
    });
})


module.exports = EJSrouter;