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

	const data = JSON.stringify({ name, token: localStorage.getItem('token') });

	$.ajax({ url: 'create', type:'POST', data, contentType: 'application/json', success: res => {
		if (res.success === false) alert(res.text);
	}});
}
