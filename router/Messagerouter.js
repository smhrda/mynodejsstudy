const express = require('express');
const Messagerouter = express.Router();
const conn = require('../config/DBConfig.js'); //DB 정보 등록

// Message 라우터
Messagerouter.get('/Message', (req, res) => {

    // 현재 로그인한 사용자가 받은 메세지를 검색하는 기능
    let sql = "select * from web_message where rec=?";

    if(req.session.user){ // 로그인된 경우에만 동작
        conn.query(sql, [req.session.user.email], (err, row) => {
            console.log(row);
            
            res.render("message", {
                user : req.session.user,
                row_name : row
            });
        })
    }else{
        res.render("message", { // 로그인이 안된 경우 user는 null값
            user:req.session.user
        })
    }

})

// MessageJoin 라우터
Messagerouter.post('/MessageJoin', (req, res) => {
    let email = req.body.email;
    let pw = req.body.pw;
    let tel = req.body.tel;
    let address = req.body.address;

    let sql = "insert into web_member values(?,?,?,?,now())";

    conn.query(sql, [email, pw, tel, address], (err, row) => {
        if (!err) {
            console.log("입력 성공 : "+row);
            res.redirect('http://127.0.0.1:3001/Message');
        } else {
            console.log("입력 실패 : " + err);
        }
    })
})

// MessageLogin 라우터
Messagerouter.post('/MessageLogin', (req, res) => {
    let email = req.body.email;
    let pw = req.body.pw;

    let sql = "select * from web_member where email=? and pw=?";

    conn.query(sql, [email, pw], (err, row) => {
        if (err) {
            console.log("로그인 실패 : " + err);
        } else if (row.length > 0) { //로그인 성공
            // 세션값 저장하기
            req.session.user = {
                "email": row[0].email,
                "tel": row[0].tel,
                "address": row[0].address
            };

            console.log("session영역에 이메일 저장 성공" + req.session.user);
            console.log(row);

            res.redirect("http://127.0.0.1:3001/Message");

        } else if (row.length == 0) {   //로그인 실패
            res.redirect("http://127.0.0.1:5500/public/ex05LoginF.html");
        }
    });
});

// MessageLogout 라우터
Messagerouter.get('/MessageLogout', (req, res) => {
    delete req.session.user;
    res.redirect('http://127.0.0.1:3001/Message');
});

// MessageUpdate 라우터 - update.ejs와 랜더링하는 역할
Messagerouter.get('/MessageUpdate', (req, res) => {
    res.render("update", {
        user : req.session.user
    })

})

// MessageUpdateExe 라우터 - DB와 연결하여 실제 수정 수행
Messagerouter.post('/MessageUpdateExe', (req, res) => {
    let email = req.session.user.email; // email값은 세션에서 가져옴
    let pw = req.body.pw;
    let tel = req.body.tel;
    let address = req.body.address;

    // 사용자가 입력한 pw, tel, address로 수정하기

    let sql = "update web_member set pw=?, tel=?, address=? where email=?";

    conn.query(sql, [pw, tel, address, email], (err, row) => {
        if (!err) {
            console.log("수정 성공 : "+row);

            req.session.user = {
                "email":email,
                "tel":tel,
                "address":address
            }

            res.redirect('http://127.0.0.1:3001/Message');
        } else {
            console.log("수정 실패 : " + err);
        }
    })
})

// MessageMemberSelect 라우터
Messagerouter.get('/MessageMemberSelect', (req, res) => {

    let sql = "select * from web_member";

    conn.query(sql, (err, row) => {
        if (err) {
            console.log("검색 실패 : " + err);
        } else if (row.length > 0) { 
            //console.log(row);
            res.render("selectMember", {
                row_names : row
            });
        } else if (row.length == 0) { // 검색된 데이터가 없을 때
            res.redirect("http://127.0.0.1:3001/Message");
        }
    });
});

// MessageDelete 라우터
Messagerouter.get('/MessageDelete', (req, res) => {
    let email = req.query.email;

    let sql = "delete from web_member where email=?";

    conn.query(sql, email, (err, row) => {
        if (err) {
            console.log("삭제 실패 : " + err);
        } else if (row.affectedRows > 0) {
            console.log("명령에 성공한 수 " + row.affectedRows);
            res.redirect('http://127.0.0.1:3001/MessageMemberSelect');
        }
        else if (row.affectedRows == 0) {
            console.log("삭제된 값이 없습니다.");
            res.redirect('http://127.0.0.1:3001/Message');
        }
    })
});

// MessageSend 라우터
Messagerouter.post('/MessageSend', (req, res) => {
    
    let send = req.body.send;
    let rec = req.body.rec;
    let content = req.body.content;

    let sql = "insert into web_message(send, rec, content, send_date) values(?,?,?,now())";

    conn.query(sql, [send, rec, content], (err, row) => {
        if(!err){
            console.log("입력 성공 : "+row);
            res.redirect('http://127.0.0.1:3001/Message');
        } else {
            console.log("입력 실패 : " + err);
        }
    })
})





module.exports = Messagerouter;