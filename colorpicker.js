function addListenerMulti(element, eventNames, listener) {
	var events = eventNames.split(' ');
	for (var i=0, iLen=events.length; i<iLen; i++) {
		element.addEventListener(events[i], listener, false);
	}
}

function colorPicker(el) {
	var picker = document.querySelector(".color-picker");
	var picker_inp = picker.querySelector("input");
	var picker_close = picker.querySelector(".close");
	addListenerMulti(el, "click touchstart", function(e){
	    var cx = e.clientX || e.targetTouches[0].clientX;
	    var cy = e.clientY || e.targetTouches[0].clientY;
	    
	    var posx = false, posy = false;
	    if (cx + 310 < window.innerWidth) posx = cx;
	    else posx = window.innerWidth - 310;
	    if (cy + 160 < window.innerHeight) posy = cy;
	    else posy = window.innerHeight - 160;
	    
	    if (posy < 15) posy = 15;
	    
	    if (posx) {
	        picker.style.left = posx + "px";
	        picker.style.marginLeft = "0px";
	    } else {
	        picker.style.left = "";
	        picker.style.marginLeft = "";
	    }
	    
	    if (posy) {
	        picker.style.top = posy + "px";
	        picker.style.marginTop = "0px";
	    } else {
	        picker.style.top = "";
	        picker.style.marginTop = "";
	    }
	    
		picker_inp.value = this.value;
		this.myprevvalue = this.value;
		picker_inp.applycolor = function(color){
			if (color.length == 4) {
				color = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
			}
			el.value = color;
			el.style.background = color;
			var event = new Event('input', {
			    'bubbles': true,
			    'cancelable': true
			});
			el.dispatchEvent(event);
			var event1 = new Event('change', {
			    'bubbles': true,
			    'cancelable': true
			});
			el.dispatchEvent(event1);
		}
		var event = new Event('input', {
		    'bubbles': true,
		    'cancelable': true
		});

		picker_inp.dispatchEvent(event);
		picker.classList.remove("hidden");
		e.stopPropagation();
		e.preventDefault();
		return false;
	});
	addListenerMulti(picker_close, "click touchstart", function(e){
		picker.classList.add("hidden");
		if (el.myonchange4history && el.value != el.myprevvalue) {
			el.myonchange4history();
		}
	});
}

(function(){
    var inps = document.querySelectorAll("input[type=color]");
    for (var i = 0; i < inps.length; i++) {
        colorPicker(inps[i]);
    }
})();