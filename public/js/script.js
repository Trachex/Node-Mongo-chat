let socket = io(); 
window.onload = () => {
	$('button.chat__send').click(sendMsg);
	$('.logout').click(logOut);
	$.ajax({ url: 'auth/getid', type: 'GET', success: (res) => {
		localStorage.setItem('id', res.id);
	}});
}

function logOut(){
	fetch('/auth/logout', { method: 'GET' });
}

function sendMsg(){
	if ($('.chat__text').val() == "") return;
	const msg = {
		id: localStorage.getItem('id'),
		text: $('.chat__text').val()
	}
	socket.emit('message', msg);
	$('.chat__text').html = "";	
}

socket.on('init', (data) => {
	for(let i = 0; i < data.length; i++) {
		$('.chat__meassage-area').append($(`
		<li class="message">
			<h2 class="message__nickname">
				${data[i].user}
			</h2>
			<p class="message__text message__text_design">
				${data[i].text}
			</p>
		</li>`));
	}
});

socket.on('new message', (msg) => {
	$('.chat__meassage-area').append($(`
		<li class="message">
			<h2 class="message__nickname">
				${msg.user}
			</h2>
			<p class="message__text message__text_design">
				${msg.text}
			</p>
		</li>`));
});

