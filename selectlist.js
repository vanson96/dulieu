class SelectList {
	constructor(e){
		this.list = e;
		this.selected = -1;
		this.update();
	}

	//this.selected = [].indexOf.call(e.children, e.querySelector(".selected"));

	update(){
		let th = this;
		let items = this.list.querySelectorAll(".item");
		this.n = items.length;
		this.selected = -1;
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.classList.contains("selected")) this.selected = i;
			item.onclick = function(){
				if (th.selected >= 0) th.list.querySelector(".selected").classList.remove("selected");
				th.selected = i;
				this.classList.add("selected");
				if (th.onchange) th.onchange();
			}
		}
	}

	select(i){
		let items = this.list.querySelectorAll(".item");
		if (this.selected >= 0) th.list.querySelector(".selected").classList.remove("selected");
		if (items[i]) {
			items[i].classList.add("selected");
			this.selected = i;
		}
	}

	resetSelect(){
		if (this.selected >= 0) this.list.querySelector(".selected").classList.remove("selected");
		this.selected = -1;
	}

	add(name){
		let div = document.createElement("div");
		div.setAttribute("class", "item");
		div.innerHTML = name;
		this.list.appendChild(div);
	}

	clear(){
		let items = this.list.querySelectorAll(".item");
		for (let i = items.length-1; i>0; i--) {
			items[i].remove();
		}
	}

	remove(i){
		let items = this.list.querySelectorAll(".item");
		items[i].remove();
	}

	set(array){
		this.clear();
		for (let i = 0; i < array.length; i++) {
			this.add(array[i]);
		}
		this.update();
	}
}