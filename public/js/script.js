let socket = io();
window.onload = () => {
	$('button.create').click(createRoom);
	$('.logout').click(logOut);
	const check = localStorage.getItem('token');
	if (!check) window.location.href = '/auth';
}

function logOut() {
	localStorage.removeItem('token');
	window.location.href = '/auth';
}

function createRoom() {
	const name = $('input.name').val();
	if (!name) return;

	socket.emit('createRoom', { name, token: localStorage.getItem('token') });
}

socket.on('newRoom', msg => {
	$('div.roomList').append($(`
		<div class="room">
			<p class="roomName">${msg.name}</p>	
			<a class="link" href="/${msg.name}">Join</a>
		</div>
	`));
});

function showError(text) {
	
}