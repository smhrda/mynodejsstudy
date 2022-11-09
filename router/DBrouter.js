const express = require('express'); // 익스프레스 선언 해줘야 익스프레스에서 사용 가능함!
const DBrouter = express.Router(); // 익스프레스의 router 기능 가져오기

const conn = require('../config/DBConfig.js'); // DB 연결 정보 가져오기

// JoinDB 라우터
DBrouter.post('/JoinDB', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    let nick = req.body.nick;

    let sql = "insert into member values(?,?,?)";

    // query() : conn이 DB를 작동할 수 있도록 sql을 사용할 수 있게하는 함수
    conn.query(sql, [id, pw, nick], (err, row) => {
        if (!err) {
            //console.log("입력 성공 : "+row);
            res.redirect('http://127.0.0.1:3001/Main');
        } else {
            console.log("입력 실패 : " + err);
        }
    })
});

// Delete 라우터 - GET 방식
DBrouter.get('/Delete', (req, res) => {
    let id = req.query.id;

    let sql = "delete from member where id=?";

    conn.query(sql, id, (err, row) => {
        if (err) {
            console.log("삭제 실패 : " + err);
        } else if (row.affectedRows > 0) {
            console.log("명령에 성공한 수 " + row.affectedRows);
            res.redirect('http://127.0.0.1:3001/Main');
        }
        else if (row.affectedRows == 0) {
            console.log("삭제된 값이 없습니다.");
            res.redirect('http://127.0.0.1:3001/Main');
        }
    })
});

// Update 라우터
DBrouter.post('/Update', (req, res) => {
    let id = req.body.id;
    let select = req.body.select; // pw or nick
    let data = req.body.data; // 변경될 데이터
    let sql = '';

    if (select == 'pw') {
        sql = "update member set pw=? where id=?";
    } else if (select == 'nick') {
        sql = "update member set nickname=? where id=?";
    }
    // let sql = `update member set ${select} =? where id=?`; 이렇게도 가능함


    conn.query(sql, [data, id], (err, row) => {
        if (err) {
            console.log("수정 실패 : " + err);
        } else if (row.affectedRows > 0) {
            console.log("명령에 성공한 수 " + row.affectedRows);
            res.redirect('http://127.0.0.1:3001/Main');
        }
        else if (row.affectedRows == 0) {
            console.log("수정된 값이 없습니다.");
            res.redirect('http://127.0.0.1:3001/Main');
        }
    })
});

// SelectAll 라우터
DBrouter.get('/SelectAll', (req, res) => { // 따로 POST라고 지정해주지 않으면 GET 방식임

    let sql = "select * from member";

    conn.query(sql, (err, row) => {
        if (err) {
            console.log("검색 실패 : " + err);
        } else if (row.length > 0) {
            console.log("검색된 데이터의 수 : " + row.length);

            // res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            // res.write("<html>")
            // res.write("<body>");
            // res.write("<table border='1'>");
            // res.write("<tr>");
            // res.write("<th>ID</th>");
            // res.write("<th>PW</th>");
            // res.write("<th>NICK</th>");
            // res.write("</tr>");

            // for (let i = 0; i < row.length; i++) {
            //     res.write("<tr>");
            //     res.write("<td>" + row[i].id + "</td>");
            //     res.write("<td>" + row[i].pw + "</td>");
            //     res.write("<td>" + row[i].nickname + "</td>");
            //     res.write("<td><a href='http://127.0.0.1:3001/SelectDelete?id="+row[i].id+"'>삭제</a></td>"); // 쿼리스트링 방식으로 변수 보내기
            //     res.write("</tr>");
            // }
            // res.write("</table>");
            // res.write("</body>");
            // res.write("</html>");
            // res.end();
            res.render("SelectAll", {
                row_names: row
            })
        } else if (row.length == 0) {
            console.log("검색된 데이터가 없습니다.");
        }
    });
});

// SelectOne 라우터
DBrouter.get('/SelectOne', (req, res) => {
    let id = req.query.id;

    let sql = "select * from member where id=?";

    conn.query(sql, id, (err, row) => {
        if (err) {
            console.log("검색 실패 : " + err);
        } else if (row.length > 0) {
            console.log("검색된 데이터의 수 : " + row.length);
            console.log(row);
            res.render("SelectOne", {
                row_name: row // row_name이라는 이름으로 row값을 selectOne.ejs로 보냄
            });
        } else if (row.length == 0) {
            console.log("검색된 데이터가 없습니다.");
        }
    });
});

// SelectDelete 라우터
DBrouter.get('/SelectDelete', (req, res) => {
    let id = req.query.id;

    let sql = "delete from member where id=?";

    conn.query(sql, id, (err, row) => {
        if (err) {
            console.log("삭제 실패 : " + err);
        } else if (row.affectedRows > 0) {
            console.log("명령에 성공한 수 " + row.affectedRows);
            res.redirect('http://127.0.0.1:3001/SelectAll');
        }
        else if (row.affectedRows == 0) {
            console.log("삭제된 값이 없습니다.");
            res.redirect('http://127.0.0.1:3001/Main');
        }
    })
});

// LoginMember 라우터
DBrouter.post('/LoginMember', (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;

    let sql = "select * from member where id=? and pw=?";

    conn.query(sql, [id, pw], (err, row) => {
        if (err) {
            console.log("로그인 실패 : " + err);
        } else if (row.length > 0) { //로그인 성공
            req.session.user = id; // 세션값 저장하기
            console.log("session영역에 아이디 저장 성공" + req.session.user);
            res.render('ex05LoginS', {
                id_name: id
            })
        } else if (row.length == 0) {   //로그인 실패
            res.redirect("http://127.0.0.1:5500/public/ex05LoginF.html");
        }
    });
});

// Main 라우터
DBrouter.get('/Main', (req, res) => {
    res.render('Main', { // ejs는 라우터를 통해 실행해야 함
        id: req.session.user     // 아이디 값 넘어감
    })
})

// Logout 라우터
DBrouter.get('/Logout', (req, res) => {
    delete req.session.user; //세션 삭제

    res.render('Main', { // ejs는 라우터를 통해 실행해야 함
        id: req.session.user     // NUll 값으로 넘어감
    })
})


module.exports = DBrouter;