// Scripts belongs in tag scripts or in separate files, inline scripts shouldn't be that long.
try {

	let myinvcode = localStorage.getItem('myinvcode');
	if (myinvcode) {
		console.log("read "+myinvcode);
		verify(myinvcode);
	}

} catch (err) {}
function verify(parampass) { // I created the function, which is called onclick on the button

	let myinvcode = parampass || document.getElementById('password').value;

	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/payinvite/checkinvite.php?pass='+myinvcode);
	xhr.send();

	xhr.onload = function() {
	  if (xhr.response == 'ok') {
	  	document.getElementById('HIDDENDIV').classList.remove("hiddenpay"); // Using class instead of inline CSS
    	document.getElementById('credentials').classList.add("hiddenpay"); // Hide the div containing the credentials

    	try {
    		localStorage.setItem('myinvcode', myinvcode);
    	} catch (err) {}

	  } else {
	  	if (!parampass) {
		  	alert('Неверный код! Повторите попытку');
	    	password.setSelectionRange(0, password.value.length);
	    }

    	try {
    		localStorage.removeItem('myinvcode');
    	} catch (err) {}
	  }
	}

	xhr.onerror = function() {
	  alert(`Ошибка соединения`);
	};
  return false;
}