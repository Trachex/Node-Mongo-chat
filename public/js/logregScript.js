function req(url, requestType, data, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		callback(this.responseText);
    	}
  	};
  	xhttp.open(requestType, url, true);
  	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(data);
}
function logIn(){
	let nick_input = document.getElementsByClassName('login__nick_style')[0].value;
	let pass_input =  document.getElementsByClassName('login__pass_style')[0].value;
	if(nick_input == "" || pass_input == "") alert('Please, enter something');
	else {
		let FD = new FormData(document.getElementsByClassName('login__form')[0]);
		let formObj = {};
		for(let [key, value] of FD.entries()){
			formObj[key] = value;
		}
		req('login', "POST", JSON.stringify(formObj), (res)=>{
			if (res == "false") alert('Wrong');
			else window.location.href = '/chat';
		});
	}
}
function register(){
	let nick_input = document.getElementsByClassName('register__nick_style')[0].value;
	let pass_input = document.getElementsByClassName('register__pass_style')[0].value;
	let name_input = document.getElementsByClassName('register__name_style')[0].value;
	if(nick_input == "" || pass_input == "" || name_input == "") alert('Please, enter something');
	else{
		let date = new Date();
		let FD = new FormData(document.getElementsByClassName('register__form')[0]);
		let formObj = {};
		for(let [key, value] of FD.entries()){
			formObj[key] = value;
		}
		formObj.regdata = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
		req('registration', "POST", JSON.stringify(formObj), (res)=>{
			if (res == "false") alert('Wrong');
			else window.location.href = '/chat';
		});
	}
}