function myInputRange(inr){
	let range = inr.querySelector("input[type=range]");
	let input = inr.querySelector("input[type=text]");
	range.addEventListener('touchstart', function(e){e.stopPropagation();});
	range.addEventListener('touchmove', function(e){e.stopPropagation();});
	range.addEventListener('touchend', function(e){e.stopPropagation();});
	input.myrange = range;
	range.oninput = function(){
		var val = parseFloat(this.value);
		input.value = val;
		if (input.myonchange) input.myonchange(val);
	}
	range.onchange = function(){
		var val = parseFloat(this.value);
		if (input.myonchange4history) input.myonchange4history(val);
	}
	input.onchange = function(){
		var val = checkMinMax(this);
		input.value = val;
		range.value = val;
		if (input.myonchange && !input.myonchange4history) input.myonchange(val);
		if (input.myonchange4history) input.myonchange4history(val);
	}
}

{
	let input_ranges = document.querySelectorAll(".input_range");
	for (let i = 0; i < input_ranges.length; i++) {
		myInputRange(input_ranges[i]);
	}
}

;(function(){
  
  function emit(target, name) {
    var event
    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(name, true, true);
    } else {
      event = document.createEventObject();
      event.eventType = name;
    }

    event.eventName = name;

    if (document.createEvent) {
      target.dispatchEvent(event);
    } else {
      target.fireEvent("on" + event.eventType, event);
    }    
  }

  var outputsSelector = "input[type=text][source],select[source]";
  
  function onChange(e) {
    var outputs = document.querySelectorAll(outputsSelector)
    for (var index = 0; index < outputs.length; index++) {
      var item = outputs[index]
      var source = document.querySelector(item.getAttribute('source'));
      if (source) {
        if (item === e.target) {
          source.value = item.value
          emit(source, 'input')
          emit(source, 'change')
        }

        if (source === e.target) {
          item.value = source.value
        }
      }
    }
  }
  
  document.addEventListener('change', onChange)
  document.addEventListener('input', onChange)
}());