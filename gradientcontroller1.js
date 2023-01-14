class GradientController {
	constructor(data){
		if (data) this.data = data;
		else this.data = {
			begin: {x: 0, y: 0},
			end: {x: 1, y: 1},
			colors: [
				{color: "#33bbff", pos: 0},
				{color: "#D932FF", pos: 1}
			]
		}
	}
	updateColorsFromDom(){
		this.data.colors = [];
		let colors = this.parent.querySelectorAll(".input_color");
		for (let i = 0; i < colors.length; i++) {
			let color = colors[i];
			this.data.colors.push({
				color: color.firstChild.value,
				pos: parseFloat(color.nextElementSibling.value) || 0
			});
		}
		this.data.colors.sort(function(a,b){return a.pos-b.pos});
	}
	updatePointsFromDom(){
		this.data.begin.x = parseFloat(this.beginx.value) || 0;
		this.data.begin.y = parseFloat(this.beginy.value) || 0;
		this.data.end.x = parseFloat(this.endx.value) || 0;
		this.data.end.y = parseFloat(this.endy.value) || 0;
	}
	createDom(parent){
		let th = this;
		this.parent = parent;
		parent.innerHTML = "";

		let cols = document.createElement("div");
		cols.setAttribute("class", "cols");

		let col1 = document.createElement("div");
		col1.setAttribute("class", "col first");
		col1.setAttribute("style", "z-index: 12;left:10px;position:fixed;top:10px;");

		let col2 = document.createElement("div");
		col2.setAttribute("class", "col");
		col2.setAttribute("style", "z-index: 12;right:10px;position:fixed;top:10px;");

		this.col1 = col1;
		this.col2 = col2;
		this.cols = cols;

		cols.appendChild(col1);
		cols.appendChild(col2);
		parent.appendChild(cols);

		let label, inputx, inputy;
		let pointsOnChange = function(){
			th.updatePointsFromDom();
			if (th.onchange) th.onchange();
		};
		let colorsOnChange = function(){
			th.updateColorsFromDom();
			if (th.onchange) th.onchange();
		};

		label = document.createElement("div");
		label.setAttribute("class", "label small");
		inputx = document.createElement("input");
		inputx.setAttribute("type", "text");
		inputx.setAttribute("class", "fourth first");
		inputx.setAttribute("class", "small first");
		inputx.setAttribute("style", "top:10px");
		inputy = document.createElement("input");
		inputy.setAttribute("type", "text");
		inputy.setAttribute("class", "fourth");
		inputy.setAttribute("class", "small");
		inputy.setAttribute("style", "top:10px;margin-left: 5px;");

		inputx.onchange = pointsOnChange;
		inputy.onchange = pointsOnChange;

		label.innerHTML = "Start (X, Y):";
		this.beginx = inputx;
		this.beginy = inputy;
		inputx.value = this.data.begin.x;
		inputy.value = this.data.begin.y;

		col1.appendChild(label);
		col1.appendChild(inputx);
		col1.appendChild(inputy);

		label = document.createElement("div");
		label.setAttribute("class", "label small");
		inputx = document.createElement("input");
		inputx.setAttribute("type", "text");
		inputx.setAttribute("class", "fourth first");
		inputx.setAttribute("class", "small first");
		inputx.setAttribute("style", "top:10px");
		inputy = document.createElement("input");
		inputy.setAttribute("type", "text");
		inputy.setAttribute("class", "fourth");
		inputy.setAttribute("class", "small");
        inputy.setAttribute("style", "top:10px;margin-left: 5px;");
        
		inputx.onchange = pointsOnChange;
		inputy.onchange = pointsOnChange;

		label.innerHTML = "End (X, Y):";
		this.endx = inputx;
		this.endy = inputy;
		inputx.value = this.data.end.x;
		inputy.value = this.data.end.y;

		col2.appendChild(label);
		col2.appendChild(inputx);
		col2.appendChild(inputy);

		for (let i = 0; i < this.data.colors.length; i++) {
			let c = this.data.colors[i];

			let col = cols;//i%2 == 0 ? col1 : col2;
			cols.setAttribute("style", "position:fixed;top:70px;overflow: -moz-scrollbars-vertical; overflow-y: scroll;overflow-x:hidden; height: 150px;");
			let div0 = document.createElement("div");
			div0.setAttribute("class", "grd_color_item");
			let div = document.createElement("div");
			div.setAttribute("class", "input_color");
			div.innerHTML = `<input type="color" value="${c.color}" style="background:${c.color};">`;
			let inp = document.createElement("input");
			inp.setAttribute("type", "text");
			inp.setAttribute("class", "fourth");
			inp.value = c.pos;

			colorPicker(div.firstChild);
			div.firstChild.onchange = colorsOnChange;
			inp.onchange = colorsOnChange;

			div0.appendChild(div);
			div0.appendChild(inp);
			col.appendChild(div0);
		}

		let btnadd = this.btnadd = document.createElement("div");
		let btnrem = this.btnrem = document.createElement("div");
        let btncl = this.btncl = document.createElement("div");

        btncl.setAttribute("class", "fa fa-times-circle");
        btncl.setAttribute("style", "font-size: 17px;position:fixed;color: #D4D4DC;top:5px;right:5px;");
		btnadd.setAttribute("class", "btn addcolor");
		btnadd.setAttribute("class", "btn smallui");
		btnadd.setAttribute("style", "position:fixed;bottom:10px;right:10px;font-size: 14px;");
		btnadd.innerHTML = "Add Color";
		btnrem.setAttribute("class", "btn remcolor");
		btnrem.setAttribute("class", "btn smallui");
		btnrem.setAttribute("style", "position:fixed;bottom:10px;left:10px;font-size: 14px;");
		btnrem.innerHTML = "Delete color";


        parent.appendChild(btncl);
		parent.appendChild(btnadd);
		parent.appendChild(btnrem);

		if (this.canbeglobal) {
			//<div class="label checkbox">General gradient letters</div>
			this.checkboxglobal = document.createElement("div");
			this.checkboxglobal.setAttribute("class", "label checkbox");
			this.checkboxglobal.innerHTML = "General gradient letters";
			parent.appendChild(this.checkboxglobal);
			labelCheckbox(this.checkboxglobal);
			if (this.data.global) this.checkboxglobal.set(true);
			else this.checkboxglobal.set(false);
			this.checkboxglobal.onchange = function(){
				if (this.checked) th.data.global = true;
				else delete th.data.global;
				if (th.onchange) th.onchange();
			}
		}


	btncl.onclick = function(){
		viewdiv('bgcolors');
		}


		btnadd.onclick = function(){
			let n = th.data.colors.length;
			let col = th.cols;//n%2 == 0 ? th.col1 : th.col2;
			let c = {color: "#FF7575", pos: 0.5};
			th.data.colors.push(c);
			th.data.colors.sort(function(a,b){return a.pos-b.pos});

			let div0 = document.createElement("div");
			div0.setAttribute("class", "grd_color_item");
			let div = document.createElement("div");
			div.setAttribute("class", "input_color");
			div.innerHTML = `<input type="color" value="${c.color}" style="background:${c.color};">`;
			let inp = document.createElement("input");
			inp.setAttribute("type", "text");
			inp.setAttribute("class", "fourth");
			inp.value = c.pos;

			colorPicker(div.firstChild);
			div.firstChild.onchange = colorsOnChange;
			inp.onchange = colorsOnChange;

			div0.appendChild(div);
			div0.appendChild(inp);
			col.appendChild(div0);

			colorsOnChange();
		}

		btnrem.onclick = function(){
			let n = th.data.colors.length;
			if (n == 2) return;
			let col = th.cols;//n%2 == 0 ? th.col2 : th.col1;
			col.lastElementChild.remove();
			//col.lastElementChild.remove();
			th.updateColorsFromDom();

			colorsOnChange();
		}
	}
}