let socket = io();
window.onload = () => {
	const token = localStorage.getItem('token');
	if (!token) window.location.href = '/auth';

	$('button.send').click(send);

	socket.emit('newUser', { token, room: roomName });
}

socket.on('userConnect', msg => {
	$('div.meassageArea').append(`${msg.user} Connected to the Chat`);
});

socket.on('userDisconnect', msg => {
	$('div.meassageArea').append(`${msg.user} Disconnected`);
})

socket.on('newUserInit', msg => {
	for (let i = 0; i < msg.length; i++) {
		appendMessage(msg[i]);
	}
});

socket.on('newMessage', msg => {
	console.log(msg);
	appendMessage(msg);
});

function send() {
	const text = $('input.textarea').val();

	if (!text) return;

	socket.emit('message', { text, token: localStorage.getItem('token'), room: roomName });

	$('input.textarea').html = "";	
}

function appendMessage(data) {
	$('div.meassageArea').append($(`
		<li class="message">
			<h2 class="messageUser">
				${data.user}
			</h2>
			<p class="messageText">
				${data.text}
			</p>
		</li>`
	));
}

function showError(text) {
	
}