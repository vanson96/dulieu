/*let sectionsDom = {};
{	
	let sidebar = document.querySelector(".sidebar");
	let sections = document.querySelectorAll(".section");
	for (let i = 0; i < sections.length; i++) {
		let s = sections[i];
		sectionsDom[s.dataset.name] = s;
		let st = s.querySelector(".section_title");
		s.mystate = s.classList.contains("opened");
		s.open = function(){
			this.classList.add("opened");
			this.mystate = true;
		}
		s.close = function(){
			this.classList.remove("opened");
			this.mystate = false;
		}
		st.onclick = function(){
			let s = this.parentNode;
			if (s.mystate) s.close();
			else s.open();
			
			if (sidebar.mypscroll) sidebar.mypscroll.update();
		}
	}
}*/

function mySection(s, sidebar){
	let st = s.querySelector(".section_title");
	s.mystate = s.classList.contains("opened");
	s.open = function(){
		this.classList.add("opened");
		this.mystate = true;
	}
	s.close = function(){
		this.classList.remove("opened");
		this.mystate = false;
	}
	st.onclick = function(){
		let s = this.parentNode;
		if (s.mystate) s.close();
		else s.open();
		
		if (sidebar.mypscroll) sidebar.mypscroll.update();
	}
}

{	
	let sidebar = document.querySelector(".sidebar");
	let sections = document.querySelectorAll(".section");
	for (let i = 0; i < sections.length; i++) {
		mySection(sections[i], sidebar);
	}
}