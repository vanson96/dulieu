class UploadImgController {
	constructor (e) {
		this.input = e.querySelector("input");
		this.btn = e.querySelector(".btn.file");
		this.label = e.querySelector(".label");
		this.rembtn = e.querySelector(".btn.fontello");
		this.defaultText = "* Изображение не выбрано";

		let th = this;

		this.input.onchange = function(){
			if (this.files.length) {
				if (th.bloburl) window.URL.revokeObjectURL(th.bloburl);

				let file = this.files[0];
				th.bloburl = window.URL.createObjectURL(file);
				th.label.innerHTML = file.name;
				th.filename = file.name;
				th.img = document.createElement("img");
				th.img.onload = function(){
					if (th.onupload) th.onupload();
				}
				th.img.setAttribute("src", th.bloburl);
				th.rembtn.style.display = "";
			}
		}

		this.rembtn.onclick = function(){
			if (th.bloburl) window.URL.revokeObjectURL(th.bloburl);
			if (th.img) th.img.remove();
			th.input.value = "";
			th.label.innerHTML = th.defaultText;
			if (th.onclear) th.onclear();
			th.rembtn.style.display = "none";
		}
	}
}

class UploadFontController {
	constructor (e) {
		this.input = e.querySelector("input");
		this.btn = e.querySelector(".btn.file");
		this.label = e.querySelector(".label");
		this.rembtn = e.querySelector(".btn.fontello");
		this.defaultText = "* Файл шрифта не выбран";
		this.divforstyle = document.getElementById("emptydivforstyle");
		this.fontfilenum = 1;

		let th = this;

		this.input.onchange = function(){
			if (this.files.length) {
				if (th.bloburl) window.URL.revokeObjectURL(th.bloburl);

				let file = this.files[0];
				th.bloburl = window.URL.createObjectURL(file);
				th.label.innerHTML = file.name;
				
				th.fontname = "myfont" + th.fontfilenum;
				let styletext = '';
			    styletext += '@font-face {';
			    styletext += "font-family: '"+th.fontname+"';";
			    styletext += "src: url('"+th.bloburl+"');}";
			    th.divforstyle.innerHTML = "<style>" + styletext + "</style><span style=\"font-family:'" + th.fontname + "';\">AaBbQqWw123АаБбЮюйЙеЕ0</span>";

			    if (th.onupload) th.onupload();

				th.rembtn.style.display = "";
			}
			th.fontfilenum++;
		}

		this.rembtn.onclick = function(){
			if (th.bloburl) window.URL.revokeObjectURL(th.bloburl);
			th.input.value = "";
			th.label.innerHTML = th.defaultText;
			if (th.onclear) th.onclear();
			th.rembtn.style.display = "none";
		}
	}
}