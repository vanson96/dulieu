(function(){
	let createdPayDivHtml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px" style="z-index:10;position: absolute; top: -5px; right: -10px; width: 16px; height: 16px; background: #424851; border: 8px solid #424851; cursor: pointer; border-radius: 50%;"><path fill="#fff" d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path></svg><p style=" font-size: 11pt;">available from <span style="cursor:pointer;color:#9D94F9;">premium invite</span></p>	<br>  <input type="text" id="password" placeholder="Your Invite Code">  <br><br>	<div class="btn111">ACTIVATE</div>	<div class="btn112">BUY</div>';

	// удали / замени условие на true если будешь вручную добавлять скрипт этот только в нужные редакторы
	if (!document.getElementById('credentials')) {

		let createdPayDiv;
		let createdPayDivCloseBtn;
		let createdPayDivCheckBtn;
		let createdPayDivBuyBtn;
		let createdPayDivSuccessFunc;
		let createdPayDivInput;
		let createdPayDivSpan;
		let unlocked = false;

		createdPayDiv = document.createElement('div');
		createdPayDiv.setAttribute("style", "display:none;width:270px;position:fixed;top:0;left:0;z-index:100500;padding:10px 0 20px;");
		createdPayDiv.setAttribute("class", "credentials11");
		createdPayDiv.innerHTML = createdPayDivHtml;

		createdPayDivInput = createdPayDiv.querySelector("input");
		createdPayDivSpan = createdPayDiv.querySelector("span");
		createdPayDivCloseBtn = createdPayDiv.querySelector("svg");
		createdPayDivCheckBtn = createdPayDiv.querySelector(".btn111");
		createdPayDivBuyBtn = createdPayDiv.querySelector(".btn112");

		document.body.appendChild(createdPayDiv);

		let verify = function(parampass, unlock) {

			let passInput = createdPayDivInput;
			let myinvcode = parampass || passInput.value;

			let xhr = new XMLHttpRequest();
			xhr.open('GET', '/payinvite/checkinvite.php?pass='+myinvcode);

			xhr.onload = function() {
				if (xhr.response == 'ok') {
					unlocked = true;
					if (unlock) unlock();
					try {localStorage.setItem('myinvcode', myinvcode);} catch (err) {}
				} else {
				  	if (!parampass) {
					  	alert('Неверный код! Повторите попытку');
				    	passInput.setSelectionRange(0, passInput.value.length);
				    }
			    	try {localStorage.removeItem('myinvcode');} catch (err) {}
				}
			}

			xhr.onerror = function() {
				alert(`Connection error`);
			};

			xhr.send();

		  	return false;
		}

		try {
			let myinvcode = localStorage.getItem('myinvcode');
			if (myinvcode) {
				verify(myinvcode);
			}
		} catch (err) {}

		createdPayDivCloseBtn.onclick = function(){
			createdPayDiv.style.display = 'none';
		}
		createdPayDivCheckBtn.onclick = function(){
			verify(false, createdPayDivSuccessFunc);
		}
		createdPayDivBuyBtn.onclick = function(){
			window.open("https://en.fonttextup.com/payinvite/pay.php", '_blank').focus();
		}
		createdPayDivInput.onkeydown = function(event){
			if (event.keyCode == 13) createdPayDivCheckBtn.onclick();
		}
		createdPayDivSpan.onclick = function(){
			createdPayDivBuyBtn.onclick();
		}

		/*
		let oldListener = mydom.fontfamily.myoninput;
		mydom.fontfamily.myoninput = function(val){
		*/
		///
		
				    let oldListener5 = mydom.fontfamily.myoninput;
		mydom.fontfamily.myoninput = function(val){
	
			if (unlocked) {
				oldListener5(val);
			} else {
				createdPayDivSuccessFunc = function(){
					oldListener5(val);
					createdPayDivCloseBtn.onclick();
				}
				createdPayDiv.style.display = '';
			}
		}
		
		mydom.uploadfont.input.onclick = function(){this.value=null}
		let oldListener0 = mydom.uploadfont.input.onchange;
		let oldListener = function(){oldListener0.call(mydom.uploadfont.input)}
		mydom.uploadfont.input.onchange = function(val){
		///
			if (unlocked) {
				oldListener(val);
			} else {
				createdPayDivSuccessFunc = function(){
					oldListener(val);
					createdPayDivCloseBtn.onclick();
				}
				createdPayDiv.style.display = '';
			}
		}
		
	    let oldListener1 = mydom.btnaddlayer.onclick;
		mydom.btnaddlayer.onclick = function(val){
		///
			if (unlocked) {
				oldListener1(val);
			} else {
				createdPayDivSuccessFunc = function(){
					oldListener1(val);
					createdPayDivCloseBtn.onclick();
				}
				createdPayDiv.style.display = '';
			}
		}
	
	

			    let oldListener2 = canvasbar.querySelector(".export").onclick;
		canvasbar.querySelector(".export").onclick = function(val){
		///
			if (unlocked) {
				oldListener2(val);
			} else {
				createdPayDivSuccessFunc = function(){
					oldListener2(val);
					createdPayDivCloseBtn.onclick();
				}
				createdPayDiv.style.display = '';
			}
		}
	
	
	
	
				    let oldListener3 = mydom.applysizebtn.onclick;
		mydom.applysizebtn.onclick = function(val){
		///
			if (unlocked) {
				oldListener3(val);
			} else {
				createdPayDivSuccessFunc = function(){
					oldListener3(val);
					createdPayDivCloseBtn.onclick();
				}
				createdPayDiv.style.display = '';
			}
		}
	
	
			let oldListener04 = mydom.btnremlayer.onclick;
		let oldListener4 = function(){oldListener04.call(mydom.btnremlayer)}
		mydom.btnremlayer.onclick = function(val){
			if (unlocked) {
				oldListener4(val);
			} else {
				createdPayDivSuccessFunc = function(){
					oldListener4(val);
					createdPayDivCloseBtn.onclick();
				}
				createdPayDiv.style.display = '';
			}
		}
	
	
	}
	
	
	
	
})();