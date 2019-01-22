const MongoClient = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');
const Cookies = require('cookies');
const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let store;
let userArr = {};

app.use(express.static('app'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	store: store
}));

const url = 'mongodb://localhost:27017/ChatDB';

app.get('/', function(req, res){
	if(req.session.username == undefined) res.redirect('/logreg');
	else res.redirect('/chat');
});

app.get('/logreg', function(req, res){
	res.sendFile(__dirname + '/app/logreg.html');
});

app.get('/chat', function(req, res){
	if(req.session.username == undefined) res.redirect('/logreg');
	else res.sendFile(__dirname + '/app/chat.html');
});

app.post('/login', (req, res) => {
	let login = req.body.nickname;
	let pass = req.body.password;
	MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
		let db = client.db('ChatDB');
		let collection = db.collection('accounts');
		
		collection.find({nickname : login}).toArray((err, data) => {
			if (data.length && (login == data[0].nickname && pass == data[0].password)) {
				req.session.username = data[0].nickname;
				userArr[req.session.id] = data[0].nickname;
				let cookies = new Cookies(req, res);
				cookies.set('login', data[0].nickname, { httpOnly: false });
				cookies.set('sessionId', req.session.id, { httpOnly: false });
				res.redirect('/chat');
				client.close();
			}
			else {
				res.send(false);
				client.close();
			}
		});
	});
});

app.post('/logout', (req, res)=>{
	
});

app.post('/registration', function(req, res){
	req.body.messagesAmount = 0;
	let data = req.body;
	let login = req.body.nickname;

	MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
		let db = client.db('ChatDB');
		let collection = db.collection('accounts');

		collection.find({nickname : login}).toArray((err1, result) => {
			if (result.length === 0) {
				collection.insert(data, (insErr, insRes)=> {
					if(insErr) throw insErr;
					req.session.username = login;
					userArr[req.session.id] = login;
					let cookies = new Cookies(req, res);
					cookies.set('login', login, { httpOnly: false });
					cookies.set('sessionId', req.session.id, { httpOnly: false });
					res.redirect('/chat');
					client.close();
				});
			}
			else {
				res.send(false);
				client.close();
			}
		});
		
	});
	
});

let amountOfUsers = 0;

io.on('connection', function(socket){
	amountOfUsers++;
	console.log('user connected' + ' ' + 'amountOfUsers = ' + amountOfUsers);
	io.emit('userAmount', amountOfUsers);

	MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
		let db = client.db('ChatDB');
		let collection = db.collection('messages');
		let collectionA = db.collection('accounts');
		
		collection.find({}).toArray((err, data) => {
			socket.emit('onConnect', data);
			client.close();
		});
	});

	socket.on('id', (msg) => {
		MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('ChatDB');
			let collection = db.collection('accounts');
			let nick = userArr[msg];

			collection.find({nickname: nick}).toArray((err, data) => {
				if(data.length){
					let rData = { name: data[0].name, sex: data[0].sex, regdata: data[0].regdata , mAmount: data[0].messagesAmount};
					socket.emit('profileData', rData);
					client.close();
				}
				else {
					socket.emit('profileData', false);
					client.close();
				}
			});
		});
	});
	
	socket.on('message', (msg) => {
		msg.nickname = userArr[msg.id];
		MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
			let db = client.db('ChatDB');
			let collection = db.collection('messages');
			let aCollection = db.collection('accounts');
			
			collection.insert(msg, (err0, res0) => {
				aCollection.find({nickname: msg.nickname}).toArray((err1, res1) => {
					let mA = res1[0].messagesAmount + 1;
					aCollection.updateOne({nickname: msg.nickname}, {$set: {messagesAmount: mA }}, (err2, res2) => {
						socket.emit('+1', mA);
						client.close();
					});
				});
				
			});

		});

		io.emit('new message', msg);
	});

	socket.on('disconnect', () => {
		amountOfUsers--;
		io.emit('userAmount', amountOfUsers);
    	console.log('user disconnected' + ' ' + 'amountOfUsers = ' + amountOfUsers);
	});
});

server.listen(3000);
console.log('Chat is up');