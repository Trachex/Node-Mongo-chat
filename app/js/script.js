let socket = io(); 

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    } 
    return "";
}

document.getElementsByClassName("menu__nickname")[0].innerHTML = getCookie("login");

function showMenu(){
	$(document.getElementsByClassName('menu')[0]).fadeIn("slow");
	$(document.getElementsByClassName('showClose')[0]).fadeIn("slow");
}
function hideMenu(){
	$(document.getElementsByClassName('menu')[0]).fadeOut("slow");
	$(document.getElementsByClassName('showClose')[0]).fadeOut("slow");
}

function logOut(){
	
}

function sendMsg(){
	if (document.getElementsByClassName('chat__text')[0].value == "") alert('Please, type something');
	else{
		let FD = new FormData(document.getElementsByClassName('chat__form')[0]);
		let msg = {};
		let date = new Date();
		for(let [key, value] of FD.entries()){
			msg[key] = value;
		}
		msg.date = `${date.getHours()}:${date.getMinutes()}`;
		msg.id = getCookie('sessionId');
		socket.emit('message', msg);
		document.getElementsByClassName('chat__text')[0].value = "";
	}
}

function message(name, text, date){
	return `
	<li class="message">
	<h2 class="message__nickname">
		${name}
		</h2>
	<p class="message__text message__text_design">
		${text}
	</p>
	<date class="message__date">
		${date}
	</date>
	</li>`;
}

function strToElem(str){
	const temp = document.createElement("div");
	temp.innerHTML = str;
	return temp.firstElementChild;
}

socket.on('connect', function() { 
	document.getElementsByClassName("status")[0].style.backgroundColor = "green";
});

socket.on('disconnect', function() {
	document.getElementsByClassName("status")[0].style.backgroundColor = "red";
});

socket.on('onConnect', function(data){
	let area = document.getElementsByClassName("chat__meassage-area")[0];
	for(let i = 0; i < data.length; i++){
		let li = strToElem(message(data[i].nickname, data[i].text, data[i].date));
		area.appendChild(li);
	}
});

socket.on('new message', function(msg){
	let area = document.getElementsByClassName("chat__meassage-area")[0];
	const li = strToElem(message(msg.nickname, msg.text, msg.date));
	area.appendChild(li);
});

socket.on('userAmount', function(data){
	document.getElementsByClassName('status__amount')[0].innerHTML = data;
});

socket.emit('id', getCookie('sessionId'));

socket.on('profileData', function(data){
	document.getElementsByClassName("menu__name")[0].innerHTML = data.name;
	document.getElementsByClassName("menu__sex")[0].innerHTML = data.sex;
	document.getElementsByClassName("menu__regdata")[0].innerHTML = data.regdata;
	document.getElementsByClassName("menu__mAmount")[0].innerHTML = data.mAmount;
});

socket.on('+1', function(data){
	document.getElementsByClassName("menu__mAmount")[0].innerHTML = data;
});