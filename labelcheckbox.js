function labelCheckbox(e){
	e.checked = e.classList.contains("checked");
	e.showhidenext = e.classList.contains("showhidenext");
	e.onclick = function(){
		if (this.checked) {
			this.classList.remove("checked");
			this.checked = false;
			if (this.showhidenext) this.nextElementSibling.classList.add("hidden");
			if (this.onchange) this.onchange();
		} else {
			this.classList.add("checked");
			this.checked = true;
			if (this.showhidenext) this.nextElementSibling.classList.remove("hidden");
			if (this.onchange) this.onchange();
		}
	}
	e.set = function(checked){
		if (checked) {
			this.classList.add("checked");
			this.checked = true;
			if (this.showhidenext) this.nextElementSibling.classList.remove("hidden");
		} else {
			this.classList.remove("checked");
			this.checked = false;
			if (this.showhidenext) this.nextElementSibling.classList.add("hidden");
		}
	}
}