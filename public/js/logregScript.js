window.onload = () => {
	$('button.register__button_style').click(register);
}

async function register(){
	const username = $('input.register__nick_style').val();
	const password = $('input.register__pass_style').val();
	if(username == "" || password == "") return;
	
	const data = JSON.stringify({
		username,
		password
	});
	
	$.ajax({ url: 'auth/registration', type:'POST', data, contentType: 'application/json', success:(res) => {
		if (res.success) window.location.href = '/';
		else alert(res.text);
	}});

}