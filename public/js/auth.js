window.onload = () => {
	$('button.register__button_style').click(register);
	$('button.login__button_style').click(logIn);
}

async function register() {
	const username = $('input.register__nick_style').val();
	const password = $('input.register__pass_style').val();
	if(username == "" || password == "") return;
	
	const data = JSON.stringify({
		username,
		password
	});
	
	$.ajax({ url: 'auth/registration', type:'POST', data, contentType: 'application/json', success: res => {
		if (res.success) alert('Registration is succsessful, please log in');
		else alert(res.text);
	}});

}

async function logIn() {
	const username = $('input.login__nick_style').val();
	const password = $('input.login__pass_style').val();
	if(username == "" || password == "") return;
	
	const data = JSON.stringify({
		username,
		password
	});

	$.ajax({ url: 'auth/login', type:'POST', data, contentType: 'application/json', success: res => {
		if (res.success) {
			localStorage.setItem('token', res.token);
			window.location.href = '/';
		}
		else alert(res.text);
	}});
}