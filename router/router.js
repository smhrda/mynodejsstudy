const express = require('express'); // 익스프레스 선언 해줘야 익스프레스에서 사용 가능함!
const { rmSync } = require('fs');
const router = express.Router(); // 익스프레스의 router 기능 가져오기


// plus 라우터 기능정의 및 등록
router.get('/plus', (req, res) => {
    console.log('/plus 라우터 호출');
    console.log(Number(req.query.num1) + Number(req.query.num2));

    // 결과 화면 출력하기
    // status code : 200
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" }); // 결과 출력할 HTML 만듦

    res.write("<html>");    // HTML에 글자 입력
    res.write("<body>");
    res.write("응답 성공<br>");
    res.write("결과값 : " + (Number(req.query.num1) + Number(req.query.num2)));
    res.write("</body>");
    res.write("</html>");

    res.end();  // HTML을 완성해서 보내줌
});

// cal 라우터 기능정의 및 등록
router.get('/cal', (req, res) => {
    // 1. 사용자가 입력한 값 가져오기
    let num1 = req.query.num1;
    let num2 = req.query.num2;
    let cal = req.query.cal;

    console.log(num1 + cal + num2);

    //사용자가 입력한 기호에 맞는 연산 결과값을 브라우저에 출력하기
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });

    res.write("<html>")
    res.write("<body>");
    res.write("응답 성공<br>");
    if (cal === '+') {
        res.write("결과값 : " + (Number(req.query.num1) + Number(req.query.num2)));
    } else if (cal === '-') {
        res.write("결과값 : " + (Number(req.query.num1) - Number(req.query.num2)));
    } else if (cal === '*') {
        res.write("결과값 : " + (Number(req.query.num1) * Number(req.query.num2)));
    } else if (cal === '/') {
        res.write("결과값 : " + (Number(req.query.num1) / Number(req.query.num2)));
    }
    res.write("</body>");
    res.write("</html>");
    res.end();

});

// Grade 라우터 - POST 방식 사용
router.post('/Grade', (req, res) => {
    const name = req.body.name;
    const java = Number(req.body.java);
    const web = Number(req.body.web);
    const iot = Number(req.body.iot);
    const android = Number(req.body.android);
    let avg = (java + web + iot + android) / 4;
    let grade = '';
    if (avg >= 95)
        grade = 'A+';
    else if (avg >= 90)
        grade = 'A';
    else if (avg >= 85)
        grade = 'B+';
    else if (avg >= 80)
        grade = 'B';
    else if (avg >= 75)
        grade = 'C';
    else
        grade = 'F';

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<html>")
    res.write("<body>");
    res.write("name : " + name + '<br/>');
    res.write("java : " + java + '<br/>');
    res.write("web : " + web + '<br/>');
    res.write("iot : " + iot + '<br/>');
    res.write("android : " + android + '<br/>');
    res.write("avg : " + avg + '<br/>');
    res.write("grade : " + grade);
    res.write("</body>");
    res.write("</html>");
    res.end();
})

// Join 라우터
router.post('/Join', (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<html>")
    res.write("<body>");

    res.write("ID : " + req.body.id + '<br/>');
    res.write("Name : " + req.body.name + '<br/>');
    res.write("Email : " + req.body.email + '<br/>');
    res.write("TEL : " + req.body.tel + '<br/>');
    res.write("Gender : " + req.body.gender + '<br/>');
    res.write("Country : " + req.body.country + '<br/>');
    res.write("birth : " + req.body.birth + '<br/>');
    res.write("color : " + req.body.color + '<br/>');
    res.write("hobby : " + req.body.hobby + '<br/>');
    res.write("talk : " + req.body.talk + '<br/>');

    res.write("</body>");
    res.write("</html>");
    res.end();
})

// Login 라우터
router.post('/Login', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;

    // 사용자가 입력한 id가 'smart'이고, pw가 '123'이면 성공
    // 성공 -> LoginS.html
    // 실패 -> LoginF.html
    if (id === 'smart' && pw === '123') {
        res.redirect("http://127.0.0.1:5500/public/ex05LoginS.html");
    } else {
        res.redirect("http://127.0.0.1:5500/public/ex05LoginF.html");
    }
});

//========================================================



module.exports = router;