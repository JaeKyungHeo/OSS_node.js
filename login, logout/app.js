var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}

app.put('/login', function (req, res) {
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	var item;
	users.find((user,idx) => {item = user});
	if(item.userId == req.body.userId && item.password == req.body.password && item.isAdmin){
		req.session.userId = req.body.userId;
		//req.session.isAdmin = item.isAdmin;
		res.send("Login");
	}
	else{
		res.send('유효하지 않습니다.');
	}

});

app.put('/logout', function (req, res) {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	if(req.session.userId != null){
		//req.session.userId = null;
		delete req.session.userId;
		res.send("LogOut");
	}

});

var auth = function (req, res, next) {
	// Session Check
	// 어드민 여부 체크 필요
	if (req.session.userId != null && req.session.isAdmin == true)
		next();
	else
		res.send("Error");

};
app.get('/users/:userId', auth,function (req, res) {
	// get User Information
	var userId = req.params.userId;
    console.log(users[userId]);
	res.send("OK");
});

app.post('/users', auth, function (req, res) {
	// Create book information
	users[req.body.userId] = req.body;
	res.send(users[req.body.userId]);
})

app.put('/users', auth, function (req, res) {
	// Update book information
	users[req.body.userId] = req.body;
	res.send(users[req.body.userId]);
 
})

app.delete('/users/:userID', auth, function (req, res) {
	// Delete book information
	users[req.body.userId]=null;
	res.send(user[req.body.userId]); 
})

// 사용자 추가 시에 admin 여부도 추가해야 함

var server = app.listen(80);
