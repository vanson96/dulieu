var sidebar = document.querySelector(".sidebar");
var canvasbar = document.querySelector(".canvas");
let c = document.getElementById("mycanvas");
let cc = document.createElement("canvas");
let ccc = document.createElement("canvas");
let cccc = document.createElement("canvas");
let lc = document.createElement("canvas"); // for transform whole lettering  may be "last canvas"
let lc1 = document.createElement("canvas");  // for transform a letter (char)
let ctx = c.getContext("2d");
let cctx = cc.getContext("2d");
let ccctx = ccc.getContext("2d");
let cccctx = cccc.getContext("2d");
let lctx = lc.getContext("2d");
let lctx1 = lc1.getContext("2d");
let needdrawlc = true;
let needdrawlc1 = -1; // index of letter
let movingdata = {};
let fast3drotating = false;
let movingletter = -1;
let movingletterstate = 0;

sidebar.mypscroll = new PerfectScrollbar(sidebar, {wheelPropagation: true});

let mydom = {
	scaleinp: canvasbar.querySelector("input[name=scale]"),
	scalesub: canvasbar.querySelector(".scale_sub"),
	scaleadd: canvasbar.querySelector(".scale_add"),

	bgimginp: new UploadImgController(document.querySelector(".upload.bgimg")),
	bggrdcheckbox: document.querySelector(".label.checkbox.bggradient"),
	bgcolorinp: document.querySelector("input[name=bgcolor]"),
	bgopacityinp: document.querySelector("input[name=bgopacity]"),

	winp: document.querySelector("input[name=width]"),
	hinp: document.querySelector("input[name=height]"),
	applysizebtn: document.querySelector(".btn.apply_size"),

	textarea: document.querySelector("textarea"),
	inptextx: document.querySelector("input[name=text_x]"),
	inptexty: document.querySelector("input[name=text_y]"),
	inprotate: document.querySelector("input[name=rotate]"),
	inpaxisangle: document.querySelector("input[name=axisangle]"),
	inpaxisrotate: document.querySelector("input[name=axisrotate]"),
	fontfamily: document.querySelector(".myselect.text_font"),
	textstyle: document.querySelector(".myselect.text_style"),
	textalign: document.querySelector(".myselect.text_align"),
	inpfontsize: document.querySelector("input[name=fontsize]"),
	inpletterspace: document.querySelector("input[name=letterspace]"),
	inplineheight: document.querySelector("input[name=lineheight]"),
	uploadfont: new UploadFontController(document.querySelector(".upload.font")),
	linejoin: document.querySelector(".myselect.linejoin"),
	volumedircheckbox: document.querySelector(".label.checkbox.volumedir"),
	volumedir: document.querySelector("input[name=volumedir]"),

	selectlistlayers: new SelectList(document.querySelector(".selectlist.layers")),
	selectlistletters: new SelectList(document.querySelector(".selectlist.letters")),

	btnaddlayer: document.querySelector(".btn.addlayer"),
	btnremlayer: document.querySelector(".btn.remlayer"),
	btncopylayer: document.querySelector(".btn.copylayer"),
	btntoleftlayer: document.querySelector(".btn.toleftlayer"),
	btntorightlayer: document.querySelector(".btn.torightlayer"),

	uicontainer: document.querySelector(".uicontainer")
};

let lettering;
let importopened = localStorage.getItem("importopened");
if (window.importedData || importopened) {
	lettering = window.importedData;
	if (importopened && importopened != "none") {
		lettering = JSON.parse(importopened);
		localStorage.setItem("importopened", "none");
	}
	if (lettering.layersDirection) lettering.layersDirection = new Vec(lettering.layersDirection.x, lettering.layersDirection.y);
	for (let i = 0; i < lettering.layers.length; i++) {
		let layer = lettering.layers[i];
		if (layer.fontfill && layer.fontfill.color) layer.fontfill.color = new MyColor(layer.fontfill.color);
		if (layer.fontfill && layer.fontfill.colorend) layer.fontfill.colorend = new MyColor(layer.fontfill.colorend);
		if (layer.fontstroke && layer.fontstroke.color) layer.fontstroke.color = new MyColor(layer.fontstroke.color);
		if (layer.fontstroke && layer.fontstroke.colorend) layer.fontstroke.colorend = new MyColor(layer.fontstroke.colorend);
		if (layer.translate) layer.translate = new Vec(layer.translate.x, layer.translate.y);
		if (layer.direction) {
			layer.direction = new Vec(layer.direction.x, layer.direction.y);
			console.log(layer.direction);
		}
	}
	for (let i = 0; i < lettering.letterstyles.length; i++) {
		let letter = lettering.letterstyles[i];
		if (letter) {
			if (letter.translate) letter.translate = new Vec(letter.translate.x, letter.translate.y);
			if (letter.direction) letter.direction = new Vec(letter.direction.x, letter.direction.y);
			if (letter.layers) {
				for (let i = 0; i < letter.layers.length; i++) {
					let layer = letter.layers[i];
					if (layer) {
						if (layer.fontfill && layer.fontfill.color) layer.fontfill.color = new MyColor(layer.fontfill.color);
						if (layer.fontfill && layer.fontfill.colorend) layer.fontfill.colorend = new MyColor(layer.fontfill.colorend);
						if (layer.fontstroke && layer.fontstroke.color) layer.fontstroke.color = new MyColor(layer.fontstroke.color);
						if (layer.fontstroke && layer.fontstroke.colorend) layer.fontstroke.colorend = new MyColor(layer.fontstroke.colorend);
						if (layer.translate) layer.translate = new Vec(layer.translate.x, layer.translate.y);
						if (layer.direction) layer.direction = new Vec(layer.direction.x, layer.direction.y);
					}
				}
			}
		}
	}
} else {
	lettering = {
		w: 600,
		h: 300,
		scale: 0,
		text: "Text 1 2\nsample",
		bg: {
			color: "#33bbff",
			opacity: 1,
			gradient: {
				begin: {x: 1, y: 0},
				end: {x: 0, y: 1.2},
				colors: [
					{color: "#33bbff", pos: 0},
					{color: "#B539D4", pos: 1}
				]
			}
			/*,image: {
				name: "landscape.jpg",
				path: "images/"
			}*/
		},
		fontsize: 100,
		lineheight: 1,
		letterspace: 0,
		linejoin: "miter5",
		x: 0.5,
		y: 0.43,
		align: "center",
		rotate: 0,
		axisangle: -45,
		axisrotate: 45,
		fontfamily: "Titan One",
		fontstyle: "normal",
		prevtext: "",
		letters_cache: {},
		letters: [],
		letterssorted: [],
		letterstyles: [
			{
				movez: -1,
				translate: new Vec(0.1,0.1),
				axisangle: 30,
				axisrotate: 45,
				layers: [
					false,
					{
						fontstroke: {
							color: new MyColor(0xffdd99)
						},
						fontfill: {
							color: new MyColor(0xff8850)
						}
					},
					{
						fontstroke: {
							color: new MyColor(0xff5555),
							colorend: new MyColor(0xcc2288)
						}
					},
					{
						volumerotate: -70,
						translate: new Vec(-50,50),
						n: 40
					},
					{
						volumerotate: -70,
						translate: new Vec(-42,42)
					}
				]
			}
		],
		layers: [
			{	
				name: "Outline",
				fontfill: {
					color: new MyColor(0xffffff),
					opacity: 0
				},
				fontstroke: {
					color: new MyColor(0xff0000),
					size: 10
				},
				n: 1,
				//translate: new Vec(-10,-10),
				move: -10,
				//direction: false,
				step: 1,
				gradient: {
					begin: {x: 0, y: -1},
					end: {x: 0, y: 1.5},
					colors: [
						{color: "#ff0000", pos: 0},
						{color: "#0000ff", pos: 1}
					]
				}
			},
			{
				name: "Base",
				fontfill: {
					color: new MyColor(0x22aaee),
					opacity: 1,
					gradient: {
						begin: {x: -1, y: -1},
						end: {x: 0, y: 0},
						colors: [
							{color: "#33bbff", pos: 0},
							{color: "#C277FF", pos: 1}
						],
						global: false
					}
				},
				fontstroke: {
					color: new MyColor(0xffffff),
					size: 10,
					gradient: {
						begin: {x: 0, y: -1},
						end: {x: 0, y: 1},
						colors: [
							{color: "#FFFFFF", pos: 0},
							{color: "#55FFFF", pos: 0.5},
							{color: "#FFFFFF", pos: 1}
						],
						global: true
					}
				},
				n: 1,
				//translate: new Vec(0,0),
				move: 0,
				//direction: false,
				step: 1
			},
			{
				name: "Volume",
				fontfill: {
					color: new MyColor(0x006699),
					opacity: 1
				},
				fontstroke: {
					color: new MyColor(0xeeeeee),
					colorend: new MyColor(0xaad0dd),
					size: 10
				},
				//opacity: 0.5,
				//blur: 10,
				n: 20,
				//translate: false,
				move: 1,
				//direction: false,
				step: 1
			},
			{
				name: "Shadow 1",
				fontfill: {
					color: new MyColor(0x000000),
					opacity: 1
				},
				fontstroke: {
					color: new MyColor(0x000000),
					size: 20,
				},
				n: 30,
				volumerotate: 90,
				translate: new Vec(0,4),
				move: 21,
				step: 1,
				opacity: 0.15,
				blur: 3
				//,movez: 1
			},
			{
				name: "Shadow 2",
				fontfill: {
					color: new MyColor(0x000000),
					opacity: 1
				},
				fontstroke: {
					color: new MyColor(0x000000),
					size: 17,
				},
				n: 6,
				volumerotate: 90,
				translate: new Vec(0,1),
				move: 21,
				step: 1,
				opacity: 0.15,
				blur: 1
				//,movez: 2
			}
		],
		needUpdatePositions: true
	};
}

function drawBg(){
	ctx.save();
	ctx.globalAlpha = lettering.bg.opacity;
	let fill = true;

	if (lettering.bg.image && lettering.bg.image.img) {

		if (!lettering.bg.image.prepared) {
			let img = lettering.bg.image.img;
			let imgw = img.width;
			let imgh = img.height;
			let cnvw = c.width;
			let cnvh = c.height;
			let imgwhr = imgw / imgh;
			let cnvwhr = cnvw / cnvh;
			let nimgw, nimgh;
			if (imgwhr > cnvwhr) {
				nimgh = cnvh;
				nimgw = imgwhr * nimgh;
			} else {
				nimgw = cnvw;
				nimgh = nimgw / imgwhr;
			}
			let x = Math.round((nimgw - cnvw) / 2);
			let y = Math.round((nimgh - cnvh) / 2);
			let tmpimg = img;
			while (imgw * 0.5 > nimgw * 1.2) {
				imgw = Math.round(imgw * 0.5);
				imgh = Math.round(imgh * 0.5);
				let ntmpimg = document.createElement("canvas");
				ntmpimg.width = imgw;
				ntmpimg.height = imgh;
				let ctx = ntmpimg.getContext("2d");
				ctx.drawImage(tmpimg, 0, 0, imgw, imgh);
				tmpimg = ntmpimg;
			}
			let prp = document.createElement("canvas");
			prp.width = c.width;
			prp.height = c.height;
			let ctx = prp.getContext("2d");
			ctx.drawImage(tmpimg, -x, -y, nimgw, nimgh);
			lettering.bg.image.prepared = prp;
		}

		ctx.drawImage(lettering.bg.image.prepared,0,0);
		fill = false;

	} else if (lettering.bg.gradient) {

		let grddata = lettering.bg.gradient;

		let grdbeginx = grddata.begin.x * c.width;
		let grdbeginy = grddata.begin.y * c.height;
		let grdendx = grddata.end.x * c.width;
		let grdendy = grddata.end.y * c.height;

		let grd = ctx.createLinearGradient(grdbeginx, grdbeginy, grdendx, grdendy);

		for (let i = 0, gn = grddata.colors.length; i < gn; i++) {
			grd.addColorStop(grddata.colors[i].pos, grddata.colors[i].color);
		}
		
		ctx.fillStyle = grd;
	} else {
		ctx.fillStyle = lettering.bg.color;
	}
	
	if (fill) ctx.fillRect(-1,-1,lettering.w+2,lettering.h+2);
	ctx.restore();
}

function createGradient(ctx, grddata, k, addv, ky) {

	let grdbeginx = grddata.begin.x * k;
	let grdbeginy = grddata.begin.y * (ky || k);
	let grdendx = grddata.end.x * k;
	let grdendy = grddata.end.y * (ky || k);

	if (grddata.global && addv) {
		grdbeginx += addv.x;
		grdbeginy += addv.y;
		grdendx += addv.x;
		grdendy += addv.y;
	}

	let grd = ctx.createLinearGradient(grdbeginx, grdbeginy, grdendx, grdendy);

	for (let i = 0, gn = grddata.colors.length; i < gn; i++) {
		grd.addColorStop(grddata.colors[i].pos, grddata.colors[i].color);
	}
	
	return grd;
}

let needdrawccc = false;
function drawLayersGroup(ctx, id, scaledfontsize, scaledx, scaledy) {
	//console.log(id);

	let layerstyles = lettering.layers[id];
	//console.log(layerstyles.name);
	//document.body.appendChild(ccc);
	//debugger;

	if (!layerstyles.mask) {
		ctx.drawImage(ccc, 0, 0);
		ccctx.clearRect(0,0,lettering.w+1,lettering.h+1);
	}
	needdrawccc = true;
	ccctx.save();
	if (layerstyles.mask) ccctx.globalCompositeOperation = layerstyles.mask;
	if (layerstyles.opacity !== undefined) ccctx.globalAlpha = layerstyles.opacity;
	if (layerstyles.blur && !fast3drotating) ccctx.filter = "blur(" + layerstyles.blur * (lettering.scale || lettering.autoscale) + "px)";
	ccctx.drawImage(cc, 0, 0);
	ccctx.restore();

	if (layerstyles.image && layerstyles.image.img  && !fast3drotating) {

		if (!layerstyles.image.prepared) {
			let img = layerstyles.image.img;
			let imgw = img.width;
			let imgh = img.height;
			let cnvw = ccc.width;
			let cnvh = ccc.height;
			let imgwhr = imgw / imgh;
			let cnvwhr = cnvw / cnvh;
			let nimgw, nimgh;
			if (imgwhr > cnvwhr) {
				nimgh = cnvh;
				nimgw = imgwhr * nimgh;
			} else {
				nimgw = cnvw;
				nimgh = nimgw / imgwhr;
			}
			let x = Math.round((nimgw - cnvw) / 2);
			let y = Math.round((nimgh - cnvh) / 2);
			let tmpimg = img;
			while (imgw * 0.5 > nimgw * 1.2) {
				imgw = Math.round(imgw * 0.5);
				imgh = Math.round(imgh * 0.5);
				let ntmpimg = document.createElement("canvas");
				ntmpimg.width = imgw;
				ntmpimg.height = imgh;
				let ctx = ntmpimg.getContext("2d");
				ctx.drawImage(tmpimg, 0, 0, imgw, imgh);
				tmpimg = ntmpimg;
			}
			let prp = document.createElement("canvas");
			prp.width = ccc.width;
			prp.height = ccc.height;
			let ctx = prp.getContext("2d");
			ctx.drawImage(tmpimg, -x, -y, nimgw, nimgh);
			layerstyles.image.prepared = prp;
		}

		ccctx.save();
		ccctx.globalCompositeOperation = "source-in";
		ccctx.drawImage(layerstyles.image.prepared,0,0);
		ccctx.restore();

	} else if (layerstyles.gradient && !fast3drotating) {
		layerstyles.gradient.global = true;

		ccctx.save();
		ccctx.globalCompositeOperation = "source-in";
		ccctx.fillStyle = createGradient(ccctx, layerstyles.gradient, scaledfontsize, new Vec(scaledx, scaledy));
		ccctx.fillRect(0,0,ccc.width,ccc.height);
		ccctx.restore();
	}

	

	//ccctx.clearRect(0,0,lettering.w+1,lettering.h+1);
	cctx.clearRect(0,0,lettering.w+1,lettering.h+1);
}

function drawLettering(ctx){

	ctx.font = lettering.fontstyle + " " + lettering.fontsize +"px '"+lettering.fontfamily+"'";
	cctx.font = lettering.fontstyle + " " + lettering.fontsize +"px '"+lettering.fontfamily+"'";
	ccctx.font = lettering.fontstyle + " " + lettering.fontsize +"px '"+lettering.fontfamily+"'";
	cccctx.font = lettering.fontstyle + " " + lettering.fontsize +"px '"+lettering.fontfamily+"'";

	if (lettering.linejoin == "round") {
		ctx.lineJoin="round";  //miter ctx.miterLimit=2; 
		cctx.lineJoin="round";
		ccctx.lineJoin="round";
		cccctx.lineJoin="round";
	} else {
		if (lettering.linejoin.length > 5) {
			ctx.lineJoin="miter";
			cctx.lineJoin="miter";
			ccctx.lineJoin="miter";
			cccctx.lineJoin="miter";

			let ml = parseInt(lettering.linejoin.substr(5));
			ctx.miterLimit = ml;
			cctx.miterLimit = ml;
			ccctx.miterLimit = ml;
			cccctx.miterLimit = ml;
		}
	}

	if (lettering.text != lettering.prevtext) {
		let strings = lettering.text.split("\n");
		if (!strings || !strings.length) return;
		lettering.letters = [];
		lettering.letterssorted = [];

		for (let i = 0; i < strings.length; i++) {

			let str = strings[i];
			let strobj = lettering.letters[i] = {
				letters: [],
				sumw: 0,
				n: str.length
			};

			for (let i = 0; i < str.length; i++) {
				let char = str.charAt(i) + "";
				let charw = ctx.measureText(char).width;
				strobj.sumw += charw;

				let charobj = strobj.letters[i] = {
					char: char,
					w: charw,
					whalf: charw/2
				}

				if (char == " ") continue;

				lettering.letterssorted.push(charobj);
			}
		}

		lettering.needUpdatePositions = true;
		lettering.prevtext = lettering.text;
	}


	let matrix = [[1, 0], [0, 1]];

	let x = lettering.x * lettering.w;
	let y = lettering.y * lettering.h;
	let scaledx = lettering.x * ccc.width;
	let scaledy = lettering.y * ccc.height;
	let scaledfontsize = lettering.fontsize * (lettering.scale || lettering.autoscale);
	
	if (lettering.needUpdatePositions) {
		if (lettering.axisrotate) {
			let v = new Vec(1, 0).rotate(lettering.axisangle);
			v.z = 0;
			matrix = rotateMatrix(v, degrad(lettering.axisrotate));
		}
		let lineheight = lettering.fontsize * lettering.lineheight;
		for (let i = 0; i < lettering.letters.length; i++) {
			let strobj = lettering.letters[i];
			let strwidth = strobj.sumw + (strobj.n - 1) * lettering.letterspace;
			let xx = x;
			let yy = y + i * lineheight;
			if (lettering.align == "center") {
				xx -= strwidth / 2;
			} else if (lettering.align == "right") {
				xx -= strwidth;
			}
			for (let i = 0; i < strobj.letters.length; i++) {
				let charobj = strobj.letters[i];
				charobj.x = xx + charobj.whalf;
				charobj.y = yy;
				charobj.vpos = new Vec(charobj.x - x, charobj.y - y).multMatrix(matrix);
				charobj.tocenter = charobj.vpos.clone().neg();
				charobj.vpos.x += x;
				charobj.vpos.y += y;
				xx += charobj.w + lettering.letterspace;
			}
		}
		lettering.needUpdatePositions = false;
	} else {
		if (lettering.axisrotate) {
			let v = new Vec(1, 0).rotate(lettering.axisangle);
			v.z = 0;
			matrix = rotateMatrix(v, degrad(lettering.axisrotate));
		}
	}

	let layersDirection;
	if (!lettering.layersDirection) {
		layersDirection = new Vec(0,1).rotate(lettering.axisangle);
		if (lettering.axisrotate < 0) layersDirection.neg();
	} else {
		layersDirection = lettering.layersDirection;
	}

	let datalayers = {};
	let layerskeys = [];
	let ltsn = lettering.letterssorted.length;

	let maxnlayers = 0;

	for (let j = 0; j < ltsn; j++) {
		let nlayers = 0;
		let charobj = lettering.letterssorted[j];
		let letterstyles = lettering.letterstyles[j];
		for (let i = 0, nl = lettering.layers.length; i < nl; i++) {
			let layer = lettering.layers[i];
			let charlayerstyles = {};
			//if (charobj.layersstyles && charobj.layersstyles[i]) charlayerstyles = charobj.layersstyles[i];
			if (letterstyles && letterstyles.layers && letterstyles.layers[i]) charlayerstyles = letterstyles.layers[i];
			if (!charlayerstyles.disabled) {
				let layern = charlayerstyles.n || layer.n;
				nlayers += layern;
			}
		}
		if (nlayers > maxnlayers) maxnlayers = nlayers;
	}

	//console.log(maxnlayers);
	maxnlayers += 5;

	let layerprecalculations = [];
	for (let i = 0, nl = lettering.layers.length; i < nl; i++) {
		let lpc = layerprecalculations[i] = {};
		let layer = lettering.layers[i];
		let layermatrix = false;
		if (layer.axisrotate !== undefined) {
			let v = new Vec(1, 0).rotate(layer.axisangle || 0); v.z = 0;
			layermatrix = rotateMatrix(v, degrad(layer.axisrotate));
			lpc.matrix = layermatrix;

			let layerdirection = new Vec(0,1).rotate(layer.axisangle || 0);
			if (layer.axisrotate < 0) layerdirection.neg();
			lpc.direction = layerdirection;
		}
	}

	for (let j = 0; j < ltsn; j++) {

		if (movingletter >= 0 && movingletter != j && needdrawlc1 == -1) continue;
		if (movingletterstate == 1 && needdrawlc1 > -1 && needdrawlc1 == j) continue;

		let charobj = lettering.letterssorted[j];
		let letterstyles = lettering.letterstyles[j] || {};
		let charmatrix = matrix;
		let chardirection = false;
		//let movez = 

		if (letterstyles.axisrotate !== undefined) {
			let v = new Vec(1, 0).rotate(letterstyles.axisangle || 0); v.z = 0;
			charmatrix = rotateMatrix(v, degrad(letterstyles.axisrotate));
		}

		if (letterstyles.direction) chardirection = letterstyles.direction;
		else if (letterstyles.axisangle !== undefined) {
			chardirection = new Vec(0,1).rotate(letterstyles.axisangle || 0);
			let charaxisrotate = lettering.axisrotate;
			if (letterstyles.axisrotate !== undefined) charaxisrotate = letterstyles.axisrotate;
			if (charaxisrotate < 0) chardirection.neg();
		}

		/*if (letterstyles.direction !== undefined) {
			if (letterstyles.direction === false) {
				chardirection = new Vec(0,1).rotate(letterstyles.axisangle || 0);
			} else {
				chardirection = letterstyles.direction;
			}
		}*/

		let sumzpos = letterstyles.movez * maxnlayers || 0;
		//let nlayers = 0;

		for (let i = 0, nl = lettering.layers.length; i < nl; i++) {
			let layer = lettering.layers[i];
			let lpc = layerprecalculations[i];

			let mycharmatrix = charmatrix;
			if (letterstyles.axisrotate === undefined && lpc.matrix) {
				mycharmatrix = lpc.matrix;
				if (!letterstyles.direction) chardirection = lpc.direction;
			}

			// !== undefined
			// charobj.movez === undefined
			let layerzpos;
			if (layer.movez && !letterstyles.movez) layerzpos = layer.movez * maxnlayers;

			let charlayerstyles = {};
			//if (charobj.layersstyles && charobj.layersstyles[i]) charlayerstyles = charobj.layersstyles[i];
			if (letterstyles && letterstyles.layers && letterstyles.layers[i]) charlayerstyles = letterstyles.layers[i];

			// + movez;
			//if (charlayerstyles.movez) zpos = charlayerstyles.movez;

			if (!charlayerstyles.disabled) {

				let dirtrnslt = (chardirection || layersDirection).clone();
				let movetrnslt = dirtrnslt.clone().mult(charlayerstyles.move === undefined ? layer.move : charlayerstyles.move);
				
				if (layer.volumerotate) dirtrnslt.rotate(layer.volumerotate);
				if (charlayerstyles.volumerotate) dirtrnslt.rotate(charlayerstyles.volumerotate);
				
				if (layer.translate) movetrnslt.add(layer.translate);
				if (charlayerstyles.translate) movetrnslt.add(charlayerstyles.translate);
				
				let layern = charlayerstyles.n || layer.n;

				let zpos = charlayerstyles.movez === undefined ? (layerzpos === undefined ? sumzpos : layerzpos) : charlayerstyles.movez * maxnlayers || sumzpos;

				let kincr = 1;
				if (fast3drotating) kincr = 40;
				if (movingletter >= 0) kincr = 3;

				for (let k = 0; k < layern; k+=kincr) {
					let steps = k;

					//nlayers++;

					let volumetrnslt = dirtrnslt.clone().mult(steps * layer.step);
					let trnslt = movetrnslt.clone().add(volumetrnslt);
					if (lettering.rotate) trnslt.rotate(lettering.rotate);
					//if (letterstyles.rotate) trnslt.rotate(letterstyles.rotate);

					if (!datalayers[zpos]) {
						datalayers[zpos] = [];
						layerskeys.push(zpos);
					}

					let layerelement = {};

					let yk = 1;
					if (layer.yk) yk += layer.yk;

					layerelement.layerid = i;
					layerelement.char = charobj.char;
					layerelement.x = -charobj.whalf;
					layerelement.y = 0;
					layerelement.translate1 = trnslt.clone().add(charobj.vpos);
					layerelement.rotate1 = {angle: lettering.rotate || 0, around: charobj.tocenter};
					layerelement.translate2 = letterstyles.translate || new Vec(0,0);
					layerelement.rotate2 = {angle: letterstyles.rotate || 0, around: new Vec(0,0)};
					layerelement.transform = [mycharmatrix[0][0], mycharmatrix[0][1], mycharmatrix[1][0]*yk, mycharmatrix[1][1]*yk];

					if (layer.rotate !== undefined) layerelement.rotate2.angle = layer.rotate;
					if (charlayerstyles.rotate !== undefined) layerelement.rotate2.angle = charlayerstyles.rotate;

					if (layer.mirror) {
						layerelement.transform[0] *= -1;
						layerelement.transform[1] *= -1;
					}
					if (charlayerstyles.mirror) {
						layerelement.transform[0] *= -1;
						layerelement.transform[1] *= -1;
					}
					if (layer.mirror1) {
						layerelement.transform[2] *= -1;
						layerelement.transform[3] *= -1;
					}
					if (charlayerstyles.mirror1) {
						layerelement.transform[2] *= -1;
						layerelement.transform[3] *= -1;
					}

					let styles1 = charlayerstyles.fontstroke || {};
					let styles2 = layer.fontstroke || {};

					let strokesize = styles1.size === undefined ? styles2.size || 0 : styles1.size;
					let strkopacity = styles1.opacity === undefined ? ( styles2.opacity === undefined ? 1 : styles2.opacity) : styles1.opacity;
					let radiusdist = styles1.radiusdist === undefined ? styles2.radiusdist || 0 : styles1.radiusdist;
					
					if (strokesize && strkopacity) {
						layerelement.stroke = {
							size: strokesize,
							opacity: strkopacity,
							radiusdist: radiusdist
						};

						if (styles1.gradient && !fast3drotating) {
							layerelement.stroke.color = createGradient(cctx, styles1.gradient, lettering.fontsize, charobj.tocenter);
						} else if (styles1.color) {
							if (styles1.colorend && !fast3drotating) {
								layerelement.stroke.color = styles1.color.clone().mix(styles1.colorend, k / layern).rgb();
							} else {
								layerelement.stroke.color = styles1.color.rgb();
							}
						} else if (styles2.gradient && !fast3drotating) {
							layerelement.stroke.color = createGradient(cctx, styles2.gradient, lettering.fontsize, charobj.tocenter);
						} else if (styles2.color) {
							if (styles2.colorend && !fast3drotating) {
								layerelement.stroke.color = styles2.color.clone().mix(styles2.colorend, k / layern).rgb();
							} else {
								layerelement.stroke.color = styles2.color.rgb();
							}
						}
					}

					styles1 = charlayerstyles.fontfill || {};
					styles2 = layer.fontfill || {};

					let fopacity = styles1.opacity === undefined ? ( styles2.opacity === undefined ? 1 : styles2.opacity) : styles1.opacity;
					if (fopacity) {
						layerelement.fill = {
							opacity: fopacity
						};

						if (styles1.gradient && !fast3drotating) {
							layerelement.fill.color = createGradient(cctx, styles1.gradient, lettering.fontsize, charobj.tocenter);
						} else if (styles1.color) {
							if (styles1.colorend && !fast3drotating) {
								layerelement.fill.color = styles1.color.clone().mix(styles1.colorend, k / layern).rgb();
							} else {
								layerelement.fill.color = styles1.color.rgb();
							}
						} else if (styles2.gradient && !fast3drotating) {
							layerelement.fill.color = createGradient(cctx, styles2.gradient, lettering.fontsize, charobj.tocenter);
						} else if (styles2.color) {
							if (styles2.colorend && !fast3drotating) {
								layerelement.fill.color = styles2.color.clone().mix(styles2.colorend, k / layern).rgb();
							} else {
								layerelement.fill.color = styles2.color.rgb();
							}
						}
					}

					layerelement.opacity = charlayerstyles.opacity == undefined ? (layer.opacity === undefined ? 1 : layer.opacity) : charlayerstyles.opacity;

					datalayers[zpos].push(layerelement);

					zpos++;
					sumzpos++;
				}
			}
		}
	}

	layerskeys.sort(function(a,b){return b-a;});
	//console.log(layerskeys, datalayers);

	let layerid = false;
	let lastlayerid;

	//console.log("+++++++++++");
	//ctx.save();

	//console.log("------");

	for (let i = 0, n = layerskeys.length; i < n; i++) {
		let layerelements = datalayers[layerskeys[i]];

		for (let i = 0, n = layerelements.length; i < n; i++) {
			let layerelement = layerelements[i];

			//console.log(layerelement.char, layerelement.layerid);

			if (layerelement.layerid !== layerid) {
				if (layerid !== false) {
					drawLayersGroup(ctx, layerid, scaledfontsize, scaledx, scaledy);
				}
				layerid = layerelement.layerid;
			}
			lastlayerid = layerelement.layerid;

			//console.log(layerelement.layerid);

			cctx.save();

			cccctx.clearRect(0,0,cccc.width,cccc.height);
			cccctx.setTransform(1,0,0,1,0,0);
			cccctx.save();
			cccctx.scale(cccc.myscale, cccc.myscale);

			cccctx.translate(layerelement.translate1.x, layerelement.translate1.y);
			rotate(layerelement.rotate1.angle, layerelement.rotate1.around.x, layerelement.rotate1.around.y, cccctx);
			cccctx.translate(layerelement.translate2.x * lettering.w, layerelement.translate2.y * lettering.h);
			//rotate(layerelement.rotate2.angle, layerelement.rotate2.around.x, layerelement.rotate2.around.y, cccctx);
			cccctx.transform(layerelement.transform[0], layerelement.transform[1], layerelement.transform[2], layerelement.transform[3], 0, 0);
			rotate(layerelement.rotate2.angle, layerelement.rotate2.around.x, layerelement.rotate2.around.y, cccctx);

			if (layerelement.stroke) {
				cccctx.globalAlpha = layerelement.stroke.opacity;
				cccctx.lineWidth = layerelement.stroke.size + layerelement.stroke.radiusdist;
				cccctx.strokeStyle = layerelement.stroke.color;
				cccctx.strokeText(layerelement.char, layerelement.x, layerelement.y);

				if (layerelement.stroke.opacity < 1 || !layerelement.fill || layerelement.fill.opacity < 1 || layerelement.stroke.radiusdist) {
					cccctx.globalAlpha = 1;
					cccctx.globalCompositeOperation = "destination-out";
					cccctx.fillStyle = "#000";
					cccctx.fillText(layerelement.char, layerelement.x, layerelement.y);

					if (layerelement.stroke.radiusdist) {
						cccctx.strokeStyle = "#000";
						cccctx.lineWidth = layerelement.stroke.radiusdist;
						cccctx.strokeText(layerelement.char, layerelement.x, layerelement.y);
					}

					cccctx.globalCompositeOperation = "source-over";
				}
			}

			if (layerelement.fill) {
				cccctx.globalAlpha = layerelement.fill.opacity;
				cccctx.fillStyle = layerelement.fill.color;
				cccctx.fillText(layerelement.char, layerelement.x, layerelement.y);
			}

			cccctx.restore();

			cctx.drawImage(cccc,0,0);

			//document.body.appendChild(cccc);
			//debugger;

			cctx.restore();

		}
	}

	drawLayersGroup(ctx, lastlayerid, scaledfontsize, scaledx, scaledy);
	if (needdrawccc) {
		ctx.drawImage(ccc, 0, 0);
		needdrawccc = false;
	}

	return;
}

function draw(){

	let scale = lettering.scale;
	if (!scale) {
		let fw = Math.min(parseInt(canvasbar.offsetWidth), 800);
		let fh = parseInt(canvasbar.offsetHeight) - 200;

		let lr = lettering.w / lettering.h;
		let fr = fw / fh;

		let cw, ch;

		if (lr > fr) {
			cw = Math.min(lettering.w, fw);
			ch = cw / lr;
		} else {
			ch = Math.min(lettering.h, fh);
			cw = ch * lr;
		}

		scale = cw / lettering.w;
		lettering.autoscale = scale;
	}

	let cw = Math.round(lettering.w * scale);
	let ch = Math.round(lettering.h * scale);

	let scalestr = round(scale * 100, 2);
	mydom.scaleinp.value = scalestr;

	if (needdrawlc) {
		lc.width = cw;
		lc.height = ch;

		lctx.clearRect(0,0,cw,ch);
		lctx.setTransform(1,0,0,1,0,0);
		lctx.save();
	}

	if (needdrawlc1 > -1) {
		lc1.width = cw;
		lc1.height = ch;

		lctx1.clearRect(0,0,cw,ch);
		lctx1.setTransform(1,0,0,1,0,0);
		lctx1.save();

	} else {
		c.width = cw;
		c.height = ch;

		ctx.clearRect(0,0,cw,ch);
		ctx.setTransform(1,0,0,1,0,0);
		ctx.save();
		//ctx.scale(scale, scale);

	}

	cc.width = cw;
	cc.height = ch;

	cccc.width = cw;
	cccc.height = ch;

	ccc.width = cw;
	ccc.height = ch;

	cctx.clearRect(0,0,cw,ch);
	cctx.setTransform(1,0,0,1,0,0);
	cctx.save();
	//cctx.scale(scale, scale);

	
	/*cccctx.clearRect(0,0,cw,ch);
	cccctx.setTransform(1,0,0,1,0,0);
	cccctx.save();
	cccctx.scale(scale, scale);*/

	cccc.myscale = scale;
	

	ccctx.clearRect(0,0,cw,ch);
	ccctx.setTransform(1,0,0,1,0,0);
	ccctx.save();
	//ccctx.scale(scale, scale);

	drawBg();
	if (needdrawlc) drawLettering(lctx);
	else if (needdrawlc1 > -1) drawLettering(lctx1);

	let lcx = 0;
	let lcy = 0;
	if (movingdata.x !== undefined) lcx = (movingdata.x - lettering.x) * c.width;
	if (movingdata.y !== undefined) lcy = (movingdata.y - lettering.y) * c.height;
	if (movingdata.rotate !== undefined) {
		let deg = movingdata.rotate - (lettering.rotate || 0);
		let cx = lettering.x * c.width;
		let cy = lettering.y * c.height;
		rotate(deg, cx, cy, ctx);
	}
	if (needdrawlc1 == -1) {
		if (movingletterstate == 2) {
			ctx.drawImage(lc1,lcx,lcy);
		}
		ctx.drawImage(lc,lcx,lcy);
	} else {
		//ctx.drawImage(lc1,lcx,lcy);
		//debugger;
	}

	ctx.restore();
	cctx.restore();
	ccctx.restore();
	if (needdrawlc) lctx.restore();
	if (needdrawlc1 > -1) lctx1.restore();

	needdrawlc = false;
	needdrawlc1 = -1;
}

function showLayerUI(container, i){
	container.classList.remove("hidden");
	mydom.btnremlayer.classList.remove("inactive");
	mydom.btnremlayer.dataset.layer = i;

	mydom.btncopylayer.classList.remove("inactive");
	mydom.btncopylayer.dataset.layer = i;

	if (i > 1) mydom.btntoleftlayer.classList.remove("inactive");
	else mydom.btntoleftlayer.classList.add("inactive");
	if (i < lettering.layers.length) mydom.btntorightlayer.classList.remove("inactive");
	else mydom.btntorightlayer.classList.add("inactive");
	mydom.btntoleftlayer.dataset.layer = mydom.btntorightlayer.dataset.layer = i;

	let layer = lettering.layers[i-1];

	let layeropacity = layer.opacity === undefined ? 1 : layer.opacity;
	let layerx = 0;
	let layery = 0;
	if (layer.translate) {
		layerx = layer.translate.x;
		layery = layer.translate.y;
	}

	let layerparamshtml = `
	
	
	
										 <div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:90px;"  href="javascript:void(0);" onclick="viewdiv('layersparam');"><i style="color:#FDE04A;" class="fa fa-diamond" aria-hidden="true"></i> Layer options</div>
						<div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:120px;"  href="javascript:void(0);" onclick="viewdiv('layersparamdop');">Advanced options</div>
				<div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:150px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcolor');">Layer color</div>
					<div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:180px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcolorout');">Contour  options</div>	
					
						   
						   
						   
						
							   
							    
							    			 <div class="layersparam" id="layersparam" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparam');"></div>
  
  
  
  
  
  
  
  
	<div class="section_content layerparams">
		<div style="top:70px;" class="cols">
			<div  class="col first">
				<div style="font-size:13px;" class="label small">Repeats:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="0" step="0.1" max="500" name="nrepeats" value="${layer.n}">
										<div class="input_units"><input  style="z-index: 12;width: 30px;height: 25px;font-size:10px;" type="text" source="[name=nrepeats]" value="${layer.n}" min="1" max="500" class="small"></div>
									</div>
				

	
				<div style="font-size:13px;" class="label small">3D zoom:</div>
				
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="-500" max="500" step="0.1" name="move" value="${layer.move}">
										<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;" type="text" source="[name=move]"  value="${layer.move}" class="small"></div>
									</div>
				
			
			
				
				<div style="font-size:13px;" class="label small">Transparence:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="0" step="0.1" max="1" name="opacity" value="${layeropacity}">
									<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;" type="text" source="[name=opacity]" min="0" max="1" value="${layeropacity}" class="small"></div>
									</div>
				
			

				<div style="font-size:13px;" class="label linebreaks small">Directions:</div>
				
				
				<div class="input_range">
									<input style="z-index: 12;" type="range" min="-180" step="0.1" max="180" name="volumerotate" value="${layer.volumerotate || 0}">
									<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;" type="text" source="[name=volumerotate]"  min="-180" max="180" value="${layer.volumerotate || 0}" class="small"><span></span></div>
								</div>
				
				
			</div>
			<div class="col">
				<div style="font-size:13px;" class="label small">Step:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="-100" step="0.1" max="100" name="step" value="${layer.step}">
												<div class="input_units"><input style="z-index: 12;width: 30px;height: 25px;font-size:10px;" type="text" source="[name=step]"  value="${layer.step}" min="1" max="100" class="small"></div>
							
								</div>
	
			
				<div style="font-size:13px;" class="label small">Offset X:</div>
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="-500" step="0.1" max="500" name="trnsltx" value="${layerx}">
									<div class="input_units">	<input type="text" style="width: 30px;height: 25px;font-size:10px;"  value="${layerx}" source="[name=trnsltx]" class="small"></div>
									</div>
			<div style="font-size:13px;" class="label small">Offset Y:</div>
			
			<div class="input_range">
									<input style="z-index: 12;" type="range" min="-500" step="0.1" max="500" name="trnslty" value="${layery}">
									<div class="input_units">	<input type="text" style="width: 30px;height: 25px;font-size:10px;"  value="${layery}" source="[name=trnslty]"  class="small"></div>
									</div>
				
		
				<div style="font-size:13px;" class="label small">Blur:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="0" step="0.1" max="1000" name="blur" value="${layer.blur || 0}">
										<div class="input_units"><input type="text" style="width: 30px;height: 25px;font-size:10px;"  min="0" max="1000" source="[name=blur]" value="${layer.blur || 0}" class="small"><span></span></div>
						</div>
			
		
				<div style="font-size:13px;" class="label linebreaks small">Order</div>
				<div style="font-size:13px;" class="label linebreaks small">drawings:</div>
				
				
				<div class="input_units"><input style="left:90px;width: 30px;height: 25px;font-size:10px;" type="text" name="movez" min="-50" max="50" value="${layer.movez || 0}"  class="small"></div>
			
				
			
			</div>
		</div>

		<div style="top:-245px;" class="label linebreaks">Layer mask:</div>
		<div style="z-index: 112;float: left;top:-255px;width:28%" class="myselect mask">
			<b>No</b>
			<div class="drop">
		<div  style="overflow: -moz-scrollbars-vertical; overflow-y: scroll;overflow-x:hidden; height: 110px;" >
				<span class="cur" data-val="">No</span>
				<span data-val="destination-out">Cut out</span>
				<span data-val="source-out">Cut to</span>
				<span data-val="lighter">Adding</span>
				<span data-val="multiply">Multiply</span>
				<span data-val="screen">Lightening</span>
				<span data-val="overlay">Overlap</span>
				<span data-val="lighten">Replace light</span>
				<span data-val="darken">Replacing Dark</span>
				</div>
			</div>
		</div>
	
						 <div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;bottom:-3px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorslayer');">Color Gradient</div>
						
			
						
						<div style="top:0px;">
						    <div style="position:fixed;margin-left: 35px;bottom:30px;" class="label">Gradient</div>
								<div style="z-index: 12;position:fixed;margin-left: 0px;bottom:30px;"  class="label checkbox showhidenext gradient"></div>
							   
							    
							    			 <div class="bgcolorslayer" id="bgcolorslayer" style="display:none;">
 <div class="fa fa-times-circle" style="z-index: 112;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorslayer');"></div>

 <div class="gradientcontroller" style="top:310px"></div>
	

          </div>
							                   
							
							
							</div>
		
		
	
		<div style="right:-30px;top:-266px;" class="upload">
			<div class="btn file smallui"><span class="fontello" style="margin-right:5px;">^</span> Upload<input type='file'/></div>
			<div class="btn fontello" style="display:none;">r</div>
			<div class="label small"></div>
		</div>
	</div>
	</div>
	<br>
	<div class="section">
	 <div class="layersparamdop" id="layersparamdop" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamdop');"></div>
	<div class="section_content layerparams1">
	<div class="space"></div>
	<div class="space"></div>
		<!--<div class="space"></div>
		<div class="label checkbox mirror ${layer.mirror ? "checked" : ""}">Reflect horizontally</div>-->

		<div class="label checkbox mirror1 ${layer.mirror1 ? "checked" : ""}">Reflect vertically</div>

		<div class="label small">Turn</div>
		<div class="input_range" style="margin-bottom:20px;">
			<input type="range" min="-180" value="${layer.rotate || 0}" max="180">
			<div class="input_units"><input type="text" name="rotate" value="${layer.rotate || 0}" min="-180" max="180" class="small"><span></span></div>
		</div>
		<div class="label checkbox rotate3d ${layer.axisangle === undefined ? "" : "checked"}">3D rotation:</div>
		<div class="label small">Axis angle</div>
		<div class="input_range">
			<input type="range" min="-180" value="${layer.axisangle || 0}" max="180">
			<div class="input_units"><input type="text" name="axisangle" value="${layer.axisangle || 0}" min="-180" max="180" class="small"><span></span></div>
		</div>
		<div class="label small">Rotation around axis</div>
		<div class="input_range">
			<input type="range" min="-90" value="${layer.axisrotate || 0}" max="90">
			<div class="input_units"><input type="text" name="axisrotate" value="${layer.axisrotate || 0}" min="-90" max="90" class="small"><span></span></div>
		</div>
		<div class="label small">Stretch vertically</div>
		<div class="input_range" style="margin-bottom:20px;">
			<input type="range" step="0.05" min="-1" value="${layer.yk || 0}" max="4">
			<div class="input_units"><input type="text" name="yk" value="${layer.yk || 0}" min="-1" max="4" class="small"><span></span></div>
		</div>
 </div>
  </div>
	<br>
	`;

	let fontfillcolor = layer.fontfill.color.updateHex();
	let fontfillopacity = layer.fontfill.opacity === undefined ? 1 : layer.fontfill.opacity;
	let fontfillcolorend = layer.fontfill.colorend === undefined ? "#bb9999" : layer.fontfill.colorend.updateHex();
	let fontfillcolorendon = layer.fontfill.colorend !== undefined;
	//let fontfillgradient = layer.fontfill.gradient;

	let fontfillhtml = `
	<div class="section opened">
	<div class="layersparamcolor" id="layersparamcolor" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcolor');"></div>
	<div hidden class="section_title"><span></span></div>
	<div class="section_content fontfill">
		<div class="input_color"><input type="color" name="color" value="${fontfillcolor}" style="background:${fontfillcolor};"></div>
		<div class="label inline">Color</div>
		


		<div class="label checkbox inlineleft colorend ${fontfillcolorendon?"checked":""}">Additional color</div>
		<div class="input_color"><input type="color" name="colorend" value="${fontfillcolorend}" style="background:${fontfillcolorend};"></div>


			<div style="font-size:13px;" class="label small">Transparence:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="0" step="0.1" max="1" name="opacity">
								<div class="input_units">		<input type="text" class="fourth" style="width: 30px;height: 25px;font-size:10px;" min="0" max="1" value="${fontfillopacity}" name="opacity" class="small">	</div>
									</div>
	
	 <div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;bottom:-3px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorstext');">Color Gradient</div>
	<div style="top:0px;">
						    <div style="left: 50%;transform: translate(-50%, -50%);position:fixed;margin-left: 35px;bottom:30px;" class="label">Gradient</div>
								<div style="left: 50%;transform: translate(-50%, -50%);z-index: 12;position:fixed;margin-left: -20px;bottom:30px;"  class="label checkbox showhidenext gradient"></div>
							   
							    
							    			 <div class="bgcolorstext" id="bgcolorstext" style="display:none;">
 <div class="fa fa-times-circle" style="z-index: 112;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorstext');"></div>

 <div class="gradientcontroller" style="top:310px"></div>
	

          </div>
							                   
							
							
							</div>
	
	
	</div>
	</div>
	</div>
	<br>
	`;
	
	
	let fontstrokecolor = layer.fontstroke.color.updateHex();
	let fontstrokeopacity = layer.fontstroke.opacity === undefined ? 1 : layer.fontstroke.opacity;
	let fontstrokecolorend = layer.fontstroke.colorend === undefined ? "#668899" : layer.fontstroke.colorend.updateHex();
	let fontstrokecolorendon = layer.fontstroke.colorend !== undefined;
	let fontstrokesize = layer.fontstroke.size;

	let fontstrokehtml = `
	<div class="section opened">
	<div class="layersparamcolorout" id="layersparamcolorout" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcolorout');"></div>
	
	<div hidden class="section_title"><span></span> Text outline</div>
	<div class="section_content fontstroke">
	
		<div style="font-size:13px;" class="label small">Size:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="0" step="0.1" max="500" name="size" value="${fontstrokesize || 0}">
									<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;"type="text" name="size" class="small" min="0" source="[name=size]" max="500" value="${fontstrokesize || 0}" class="small"><span></span></div>
											
							
								</div>
	
		
	
		<div class="input_color"><input type="color" name="color" value="${fontstrokecolor}" style="background:${fontstrokecolor};"></div>
		<div class="label inline">Color</div>
		<input type="text" class="fourth" style="margin-left:15px;" min="0" max="1" value="${fontstrokeopacity}" name="opacity">
		<div class="label inline" style="white-space:nowrap;width:80px;">Transparence</div>

		<div class="label checkbox inlineleft colorend ${fontstrokecolorendon?"checked":""}">Additional color</div>
		<div class="input_color"><input type="color" name="colorend" value="${fontstrokecolorend}" style="background:${fontstrokecolorend};"></div>
		<div class="iconhelp" title="Color of the last repetition if the number of repetitions is greater than 1">?</div>

			 <div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;bottom:-3px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorstextout');">Color Gradient</div>
	<div style="top:0px;">
						    <div style="left: 50%;transform: translate(-50%, -50%);position:fixed;margin-left: 35px;bottom:10px;" class="label">Gradient</div>
								<div style="left: 50%;transform: translate(-50%, -50%);z-index: 12;position:fixed;margin-left: -20px;bottom:10px;"  class="label checkbox showhidenext gradient"></div>
							   
							    
							    			 <div class="bgcolorstextout" id="bgcolorstextout" style="display:none;">
 <div class="fa fa-times-circle" style="z-index: 112;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorstextout');"></div>

 <div class="gradientcontroller" style="top:310px"></div>
	

          </div>
							                   
							
							
							</div>
	</div>
	</div>
		</div>
	`;
	

	container.innerHTML = `

<div style="top:-5px;">
	<div style="margin-left: 35%;" class="label small">Layer name:</div>

	<input style="top:25px;left: 50%;transform: translate(-50%, -50%);height: 30px;" type="text" name="name" value="${layer.name}">
</div>

	${layerparamshtml}

	${fontfillhtml}

	${fontstrokehtml}

	`;
	
	let sections = container.querySelectorAll(".section");
	for (let i = 0; i < sections.length; i++) {
		mySection(sections[i], sidebar);
	}

	let checkboxes = container.querySelectorAll(".label.checkbox");
	for (let i = 0; i < checkboxes.length; i++) {
		labelCheckbox(checkboxes[i]);
	}

	let colorinputs = container.querySelectorAll(".input_color input");
	for (let i = 0; i < colorinputs.length; i++) {
		colorPicker(colorinputs[i]);
	}

	let inptranges = container.querySelectorAll(".input_range");
	for (let i = 0; i < inptranges.length; i++) {
		myInputRange(inptranges[i]);
	}

	let mysel = container.querySelector(".myselect");
	window.myGoodSelect(mysel);

	mysel.myoninput = function(val){
		if (val) layer.mask = val;
		else if (layer.mask) delete layer.mask;
		needdrawlc = true;
		draw();
	}

	if (layer.mask) {
		let myselopts = mysel.querySelectorAll(".drop span");
		for (let i = 0; i < myselopts.length; i++) {
			if (myselopts[i].dataset && myselopts[i].dataset.val == layer.mask) {
				mysel.querySelector(".drop span.cur").classList.remove("cur");
				let myselopt = myselopts[i];
				setTimeout(function(){
					myselopt.classList.add("cur");
					mysel.querySelector("b").innerHTML = myselopt.innerHTML;
				},30);
				break;
			}
		}
	}

	let layerparamsdom = container.querySelector(".layerparams");
	let fontfilldom = container.querySelector(".fontfill");
	let fontstrokedom = container.querySelector(".fontstroke");
	let layerparamsdom1 = container.querySelector(".layerparams1");

	let grdc, grddom, grdcheckbox;
	grdcheckbox = layerparamsdom.querySelector(".label.checkbox.gradient");
	grddom = layerparamsdom.querySelector(".gradientcontroller");
	grdc = new GradientController();

	grdc.createDom(grddom);
	grdc.onchange = function(){
		if (layer.gradient) {
			layer.gradient = this.data;
			needdrawlc = true;
			draw();
		}
	}

	if (layer.gradient) {
		grdcheckbox.set(true);
		grdc.data = clone(layer.gradient);
		grdc.createDom(grddom);
	}

	let layergrdc = grdc;
	grdcheckbox.onchange = function(){
		if (this.checked) layer.gradient = layergrdc.data;
		else if (layer.gradient) delete layer.gradient;
		needdrawlc = true;
		draw();
	}


	grdcheckbox = fontfilldom.querySelector(".label.checkbox.gradient");
	grddom = fontfilldom.querySelector(".gradientcontroller");
	grdc = new GradientController();
	grdc.canbeglobal = true;

	grdc.createDom(grddom);
	grdc.onchange = function(){
		if (layer.fontfill.gradient) {
			layer.fontfill.gradient = this.data;
			needdrawlc = true;
			draw();
		}
	}

	if (layer.fontfill.gradient) {
		grdcheckbox.set(true);
		grdc.data = clone(layer.fontfill.gradient);
		grdc.createDom(grddom);
	}

	let fontfillgrdc = grdc;
	grdcheckbox.onchange = function(){
		if (this.checked) layer.fontfill.gradient = fontfillgrdc.data;
		else if (layer.fontfill.gradient) delete layer.fontfill.gradient;
		needdrawlc = true;
		draw();
	}

	grdcheckbox = fontstrokedom.querySelector(".label.checkbox.gradient");
	grddom = fontstrokedom.querySelector(".gradientcontroller");
	grdc = new GradientController();
	grdc.canbeglobal = true;

	grdc.createDom(grddom);
	grdc.onchange = function(){
		if (layer.fontstroke.gradient) {
			layer.fontstroke.gradient = this.data;
			needdrawlc = true;
			draw();
		}
	}

	if (layer.fontstroke.gradient) {
		grdcheckbox.set(true);
		grdc.data = clone(layer.fontstroke.gradient);
		grdc.createDom(grddom);
	}

	let fontstrokegrdc = grdc;
	grdcheckbox.onchange = function(){
		if (this.checked) layer.fontstroke.gradient = fontstrokegrdc.data;
		else if (layer.fontstroke.gradient) delete layer.fontstroke.gradient;
		needdrawlc = true;
		draw();
	}

	container.querySelector("input[name=name]").onchange = function(){
		layer.name = this.value;
		mydom.selectlistlayers.list.querySelector(".item.selected").innerHTML = this.value;
	}

	layerparamsdom.querySelector("input[name=nrepeats]").onchange = function(){
		layer.n = checkMinMax(this);
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=move]").onchange = function(){
		layer.move = Math.round(checkMinMax(this));
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=opacity]").onchange = function(){
		let val = checkMinMax(this);
		if (val == 1) {if (layer.opacity !== undefined) delete layer.opacity;}
		else layer.opacity = val;
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=blur]").onchange = function(){
		let val = checkMinMax(this);
		if (!val) {if (layer.blur !== undefined) delete layer.blur;}
		else layer.blur = val;
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=volumerotate]").onchange = function(){
		let val = checkMinMax(this);
		if (!val) {if (layer.volumerotate !== undefined) delete layer.volumerotate;}
		else layer.volumerotate = val;
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=step]").onchange = function(){
		layer.step = checkMinMax(this);
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=trnsltx]").onchange = function(){
		let x = checkMinMax(this);
		let y = checkMinMax(layerparamsdom.querySelector("input[name=trnslty]"));
		if (x || y) layer.translate = new Vec(x, y);
		else if (layer.translate) delete layer.translate;
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=trnslty]").onchange = function(){
		let x = checkMinMax(layerparamsdom.querySelector("input[name=trnsltx]"));
		let y = checkMinMax(this);
		if (x || y) layer.translate = new Vec(x, y);
		else if (layer.translate) delete layer.translate;
		needdrawlc = true;
		draw();
	}
	layerparamsdom.querySelector("input[name=movez]").onchange = function(){
		let val = Math.round(checkMinMax(this));
		this.value = val;
		if (!val) {if (layer.movez !== undefined) delete layer.movez;}
		else layer.movez = val;
		needdrawlc = true;
		draw();
	}

	/*layerparamsdom1.querySelector(".label.mirror").onchange = function(){
		if (this.checked) {
			layer.mirror = 1
		} else {
			if (layer.mirror !== undefined) delete layer.mirror;
		}
		needdrawlc = true;
		draw();
	}*/
	layerparamsdom1.querySelector(".label.mirror1").onchange = function(){
		if (this.checked) {
			layer.mirror1 = 1
		} else {
			if (layer.mirror1 !== undefined) delete layer.mirror1;
		}
		needdrawlc = true;
		draw();
	}

	fontfilldom.querySelector("input[name=color]").onchange = function(){
		layer.fontfill.color = new MyColor(this.value);
		
		needdrawlc = true;
		draw();
	}
	fontfilldom.querySelector("input[name=opacity]").onchange = function(){
		layer.fontfill.opacity = checkMinMax(this);
		needdrawlc = true;
		draw();
	}
	let ffce = fontfilldom.querySelector("input[name=colorend]");
	let ffcecb = fontfilldom.querySelector(".label.checkbox.colorend");
	ffcecb.onchange = function(){
		if (this.checked) {
			layer.fontfill.colorend = new MyColor(ffce.value);
		} else {
			if (layer.fontfill.colorend) delete layer.fontfill.colorend;
		}
		
		needdrawlc = true;
		draw();
	}
	ffce.onchange = function(){
		if (ffcecb.checked) {
			layer.fontfill.colorend = new MyColor(this.value);
			
			needdrawlc = true;
			draw();
		}
	}

	//stroke

	fontstrokedom.querySelector("input[name=color]").onchange = function(){
		layer.fontstroke.color = new MyColor(this.value);
		
		needdrawlc = true;
		draw();
	}
	fontstrokedom.querySelector("input[name=opacity]").onchange = function(){
		layer.fontstroke.opacity = checkMinMax(this);
		needdrawlc = true;
		draw();
	}
	let fsce = fontstrokedom.querySelector("input[name=colorend]");
	let fscecb = fontstrokedom.querySelector(".label.checkbox.colorend");
	fscecb.onchange = function(){
		if (this.checked) {
			layer.fontstroke.colorend = new MyColor(fsce.value);
		} else {
			if (layer.fontstroke.colorend) delete layer.fontstroke.colorend;
		}
		
		needdrawlc = true;
		draw();
	}
	fsce.onchange = function(){
		if (fscecb.checked) {
			layer.fontstroke.colorend = new MyColor(this.value);
			
			needdrawlc = true;
			draw();
		}
	}

	fontstrokedom.querySelector("input[name=size]").onchange = function(){
		layer.fontstroke.size = checkMinMax(this);
		needdrawlc = true;
		draw();
	}

	let layerimginp = new UploadImgController(layerparamsdom.querySelector(".upload"));
	layerimginp.onupload = function(){
		layer.image = {
			img: this.img,
			name: this.filename
		};
		needdrawlc = true;
		draw();
	}
	layerimginp.onclear = function(){
		if (layer.image) delete layer.image;
		needdrawlc = true;
		draw();
	}

	if (layer.image) {
		layerimginp.label.innerHTML = layer.image.name || "Unknown image";
		layerimginp.rembtn.style.display = "";
	}

	let inprotate = layerparamsdom1.querySelector("input[name=rotate]");

	inprotate.myonchange = function(val){
		if (!val) {
			if (layer.rotate !== undefined) delete layer.rotate;
		} else {
			layer.rotate = val;
		}
		fast3drotating = true;
		needdrawlc = true;
		draw();
	}
	inprotate.myonchange4history = function(val){
		if (!val) {
			if (layer.rotate !== undefined) delete layer.rotate;
		} else {
			layer.rotate = val;
		}
		fast3drotating = false;
		needdrawlc = true;
		draw();
	}

	let rotate3dchbx = layerparamsdom1.querySelector(".label.rotate3d");
	let inpaxisangle = layerparamsdom1.querySelector("input[name=axisangle]");
	let inpaxisrotate = layerparamsdom1.querySelector("input[name=axisrotate]");
	let inpyk = layerparamsdom1.querySelector("input[name=yk]");

	rotate3dchbx.onchange = function(){
		if (this.checked) {
			layer.axisangle = checkMinMax(inpaxisangle);
			layer.axisrotate = checkMinMax(inpaxisrotate);
		} else {
			if (layer.axisangle !== undefined) delete layer.axisangle;
			if (layer.axisrotate !== undefined) delete layer.axisrotate;
		}
		needdrawlc = true;
		draw();
	}

	inpaxisangle.myonchange = function(val){
		if (rotate3dchbx.checked) {
			layer.axisangle = val;
			fast3drotating = true;
			needdrawlc = true;
			draw();
		}
	}
	inpaxisangle.myonchange4history = function(val){
		if (rotate3dchbx.checked) {
			layer.axisangle = val;
			fast3drotating = false;
			needdrawlc = true;
			draw();
		}
	}
	inpaxisrotate.myonchange = function(val){
		if (rotate3dchbx.checked) {
			layer.axisrotate = val;
			fast3drotating = true;
			needdrawlc = true;
			draw();
		}
	}
	inpaxisrotate.myonchange4history = function(val){
		if (rotate3dchbx.checked) {
			layer.axisrotate = val;
			fast3drotating = false;
			needdrawlc = true;
			draw();
		}
	}

	inpyk.myonchange = function(val){

			layer.yk = val;
			fast3drotating = true;
			needdrawlc = true;
			draw();
	}
	inpyk.myonchange4history = function(val){

			layer.yk = val;
			if (!val && layer.yk !== undefined) delete layer.yk;
			fast3drotating = false;
			needdrawlc = true;
			draw();
	}
}

function showLetterUI(container, i){
	container.classList.remove("hidden");
	mydom.btnremlayer.classList.add("inactive");
	mydom.btncopylayer.classList.add("inactive");
	mydom.btntoleftlayer.classList.add("inactive");
	mydom.btntorightlayer.classList.add("inactive");

	let i1 = i - 1;
	let letter = lettering.letterstyles[i1];
	if (!letter) letter = lettering.letterstyles[i1] = {};

	let trnsltx = letter.translate ? letter.translate.x * 100 : 0;
	let trnslty = letter.translate ? letter.translate.y * 100 : 0;

	let direction = 0;
	if (letter.direction) {
		let v = new Vec(1,0);
		let v1 = new Vec(0,1);
		let dot1 = v.dot(letter.direction);
		let dot2 = v1.dot(letter.direction);
		let angle = raddeg(Math.acos(dot1));
		if (dot2 < 0) angle *= -1;
		direction = angle;
	}

	container.innerHTML = `
	<div style="text-align: center;" class="label small">Letter parameters applicable to all layers</div>
		 <div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:90px;"  href="javascript:void(0);" onclick="viewdiv('layersparamsymblalllayer');">Letter Options</div>
	<div class="layersparamsymblalllayer" id="layersparamsymblalllayer" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamsymblalllayer');"></div>
	
	
	
	
	
	
	
		<div class="label inlineleft checkbox movez ${letter.movez === undefined ? "" : "checked"}">Drawing order:</div>
		<div style="margin-top: 5px;" class="input_units"><input type="text"  min="-50" max="50" value="${letter.movez || 0}" name="movez" class="small"></div>

	<div class="cols">
			<div class="col first">
			<div style="font-size:12px;" class="label small">Offset X:</div>
		<div class="input_range">
			<input  type="range" min="-500" value="${trnsltx}" max="500">
			<div class="input_units"><input style="width: 35px;" type="text" name="trnsltx" value="${trnsltx}" min="-500" max="500" class="small"><span></span></div>
		</div>
		<div style="font-size:12px;" class="label small">Offset Y:</div>
			<div class="input_range">
			<input type="range" min="-500" value="${trnslty}" max="500">
			<div class="input_units"><input style="width: 35px;" type="text" name="trnslty" value="${trnslty}" min="-500" max="500" class="small"><span></span></div>
		</div>
		
			<div class="label small">Turn</div>
		<div class="input_range" style="margin-bottom:20px;">
			<input type="range" min="-180" value="${letter.rotate || 0}" max="180">
			<div class="input_units"><input type="text" name="rotate" value="${letter.rotate || 0}" min="-180" max="180" class="small"><span></span></div>
		</div>
		
			</div>
			
				<div class="col">
			
			
			
				<div style="font-size:13px;white-space: nowrap;" class="label checkbox rotate3d ${letter.axisangle === undefined ? "" : "checked"}">3D rotation:</div>
		<div class="label small">Tilt</div>
		<div class="input_range">
			<input type="range" min="-180" value="${letter.axisangle || 0}" max="180">
			<div class="input_units"><input type="text" name="axisangle" value="${letter.axisangle || 0}" min="-180" max="180" class="small"><span></span></div>
		</div>
		<div class="label small">Turn</div>
		<div class="input_range">
			<input type="range" min="-90" value="${letter.axisrotate || 0}" max="90">
			<div class="input_units"><input type="text" name="axisrotate" value="${letter.axisrotate || 0}" min="-90" max="90" class="small"><span></span></div>
		</div>
			
			</div>
			
	</div>


	
	
	

		<div class="label checkbox direction ${letter.direction ? "checked" : ""}">Layer direction:</div>
		<div class="input_range" style="margin-bottom:20px;">
			<input type="range" min="-180" value="${direction}" max="180">
			<div class="input_units"><input type="text" name="direction" value="${direction}" min="-180" max="180" class="small"><span></span></div>
		</div>
	</div>
	`;

	let checkboxes = container.querySelectorAll(".label.checkbox");
	for (let i = 0; i < checkboxes.length; i++) {
		labelCheckbox(checkboxes[i]);
	}

	let inptranges = container.querySelectorAll(".input_range");
	for (let i = 0; i < inptranges.length; i++) {
		myInputRange(inptranges[i]);
	}

	let movezchbx = container.querySelector(".label.movez");
	let movezinpt = container.querySelector("input[name=movez]");

	movezchbx.onchange = function(){
		if (this.checked) letter.movez = checkMinMax(movezinpt);
		else if (letter.movez !== undefined) delete letter.movez;
		needdrawlc = true;
		draw();
	}
	movezinpt.onchange = function(){
		if (movezchbx.checked) {
			letter.movez = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}

	let inptrnsltx = container.querySelector("input[name=trnsltx]");
	let inptrnslty = container.querySelector("input[name=trnslty]");

	inptrnsltx.myonchange = function(val){
		if (!val && !inptrnslty.value) {
			if (letter.translate) delete letter.translate;
		} else {
			letter.translate = new Vec(val / 100, inptrnslty.value / 100);
		}

		movingletter = i1;
		

		if (!movingletterstate) {
			movingletterstate = 1;
			needdrawlc1 = i1;
			draw();

			movingletterstate = 2;
			needdrawlc = true;
			needdrawlc1 = -1;
		} else {
			needdrawlc = true;
		}
		
		draw();
	}
	inptrnsltx.myonchange4history = function(val){
		if (!val && !inptrnslty.value) {
			if (letter.translate) delete letter.translate;
		} else {
			letter.translate = new Vec(val / 100, inptrnslty.value / 100);
		}
		movingletterstate = 0;
		needdrawlc1 = -1;
		movingletter = -1;
		needdrawlc = true;
		draw();
	}
	inptrnslty.myonchange = function(val){
		if (!val && !inptrnsltx.value) {
			if (letter.translate) delete letter.translate;
		} else {
			letter.translate = new Vec(inptrnsltx.value / 100, val / 100);
		}
		movingletter = i1;

		if (!movingletterstate) {
			movingletterstate = 1;
			needdrawlc1 = i1;
			draw();

			movingletterstate = 2;
			needdrawlc = true;
			needdrawlc1 = -1;
		} else {
			needdrawlc = true;
		}
		
		draw();
	}
	inptrnslty.myonchange4history = function(val){
		if (!val && !inptrnsltx.value) {
			if (letter.translate) delete letter.translate;
		} else {
			letter.translate = new Vec(inptrnsltx.value / 100, val / 100);
		}
		movingletterstate = 0;
		needdrawlc1 = -1;
		movingletter = -1;
		needdrawlc = true;
		draw();
	}

	let inprotate = container.querySelector("input[name=rotate]");

	inprotate.myonchange = function(val){
		if (!val) {
			if (letter.rotate !== undefined) delete letter.rotate;
		} else {
			letter.rotate = val;
		}
		movingletter = i1;

		if (!movingletterstate) {
			movingletterstate = 1;
			needdrawlc1 = i1;
			draw();

			movingletterstate = 2;
			needdrawlc = true;
			needdrawlc1 = -1;
		} else {
			needdrawlc = true;
		}
		
		draw();
	}
	inprotate.myonchange4history = function(val){
		if (!val) {
			if (letter.rotate !== undefined) delete letter.rotate;
		} else {
			letter.rotate = val;
		}
		movingletterstate = 0;
		needdrawlc1 = -1;
		movingletter = -1;
		needdrawlc = true;
		draw();
	}

	let rotate3dchbx = container.querySelector(".label.rotate3d");
	let inpaxisangle = container.querySelector("input[name=axisangle]");
	let inpaxisrotate = container.querySelector("input[name=axisrotate]");

	rotate3dchbx.onchange = function(){
		if (this.checked) {
			letter.axisangle = checkMinMax(inpaxisangle);
			letter.axisrotate = checkMinMax(inpaxisrotate);
		} else {
			if (letter.axisangle !== undefined) delete letter.axisangle;
			if (letter.axisrotate !== undefined) delete letter.axisrotate;
		}
		needdrawlc = true;
		draw();
	}

	inpaxisangle.myonchange = function(val){
		if (rotate3dchbx.checked) {
			letter.axisangle = val;

			movingletter = i1;

			if (!movingletterstate) {
				movingletterstate = 1;
				needdrawlc1 = i1;
				draw();

				movingletterstate = 2;
				needdrawlc = true;
				needdrawlc1 = -1;
			} else {
				needdrawlc = true;
			}
			
			draw();
		}
	}
	inpaxisangle.myonchange4history = function(val){
		if (rotate3dchbx.checked) {
			letter.axisangle = val;
			movingletterstate = 0;
			needdrawlc1 = -1;
			movingletter = -1;
			needdrawlc = true;
			draw();
		}
	}
	inpaxisrotate.myonchange = function(val){
		if (rotate3dchbx.checked) {
			letter.axisrotate = val;
			
			movingletter = i1;

			if (!movingletterstate) {
				movingletterstate = 1;
				needdrawlc1 = i1;
				draw();

				movingletterstate = 2;
				needdrawlc = true;
				needdrawlc1 = -1;
			} else {
				needdrawlc = true;
			}
			
			draw();
		}
	}
	inpaxisrotate.myonchange4history = function(val){
		if (rotate3dchbx.checked) {
			letter.axisrotate = val;
			movingletterstate = 0;
			needdrawlc1 = -1;
			movingletter = -1;
			needdrawlc = true;
			draw();
		}
	}

	let directionchb = container.querySelector(".label.direction");
	let inpdirection = container.querySelector("input[name=direction]");

	directionchb.onchange = function(){
		if (this.checked) {
			let val = checkMinMax(inpdirection);
			letter.direction = new Vec(1,0).rotate(val);
		} else {
			if (letter.direction) delete letter.direction;
		}
		needdrawlc = true;
		draw();
	}
	inpdirection.myonchange = function(val){
		if (directionchb.checked) {
			letter.direction = new Vec(1,0).rotate(val);

			movingletter = i1;

			if (!movingletterstate) {
				movingletterstate = 1;
				needdrawlc1 = i1;
				draw();

				movingletterstate = 2;
				needdrawlc = true;
				needdrawlc1 = -1;
			} else {
				needdrawlc = true;
			}
			
			draw();
		}
	}
	inpdirection.myonchange4history = function(val){
		if (directionchb.checked) {
			letter.direction = new Vec(1,0).rotate(val);
			movingletterstate = 0;
			needdrawlc1 = -1;
			movingletter = -1;
			needdrawlc = true;
			draw();
		}
	}
}

function showLetterLayerUI(container, i, j){
	container.classList.remove("hidden");
	mydom.btnremlayer.classList.remove("inactive");
	mydom.btnremlayer.dataset.layer = j;
	mydom.btncopylayer.classList.remove("inactive");
	mydom.btncopylayer.dataset.layer = j;

	if (j > 1) mydom.btntoleftlayer.classList.remove("inactive");
	else mydom.btntoleftlayer.classList.add("inactive");
	if (j < lettering.layers.length) mydom.btntorightlayer.classList.remove("inactive");
	else mydom.btntorightlayer.classList.add("inactive");
	mydom.btntoleftlayer.dataset.layer = mydom.btntorightlayer.dataset.layer = j;

	let i1 = i - 1;
	let letter = lettering.letterstyles[i1];
	if (!letter) letter = lettering.letterstyles[i1] = {};

	let j1 = j - 1;
	if (!letter.layers) letter.layers = [];
	if (!letter.layers[j1]) letter.layers[j1] = {};
	let layer = letter.layers[j1];

	let layeropacity = layer.opacity === undefined ? 1 : layer.opacity;
	let layerx = 0;
	let layery = 0;
	if (layer.translate) {
		layerx = layer.translate.x;
		layery = layer.translate.y;
	}

	let layerparamshtml = `
	
	
										 <div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:60px;"  href="javascript:void(0);" onclick="viewdiv('layersparamsymbl');">Letter Options</div>
									<div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:100px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcolorsymbol');">Letter color</div>
					<div class="btn smallui" style="left: 50%;transform: translate(-50%, -50%);position:fixed;right:0px;z-index: 12;top:140px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcoloroutsymbol');">Contour parameter</div>
	
	
	<div class="section">
	

		 <div class="layersparamsymbl" id="layersparamsymbl" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamsymbl');"></div>
	
	<div hidden class="section_title"><span></span> Layer options</div>
	<div class="section_content layerparams">
		<div class="cols">
			<div class="col first">
				<div class="label checkbox nrepeats ${layer.n === undefined ? "" : "checked"}">Repeats:</div>
				<div style="top:-10px;"  class="input_range ">
									<input style="z-index: 12;" type="range" min="0" value="${layer.n || 1}"  max="500" name="nrepeats">
											<!--	<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;" type="text" name="nrepeats" value="${layer.n || 1}" min="1" max="500" class="small"></div>	-->
											</div>
				<!--<div class="space"></div>
				<div class="label checkbox opacity ${layer.opacity === undefined ? "" : "checked"}">Transparency:</div>
				<div class="input_units"><input type="text" name="opacity" min="0" max="1" value="${layeropacity}"></div>-->
		
				<div style="font-size:12px; top:-10px;" class="label small">Direction layers:</div>
					<div style="top:-10px;" class="input_range">
									<input style="z-index: 12;" type="range" min="-180" value="${layer.volumerotate || 0}" step="0.1" max="180" name="volumerotate">
									<!--	<div class="input_units"><input type="text" name="volumerotate" min="-180" max="180" value="${layer.volumerotate || 0}" class="small"><span></span></div>-->
									</div>
				<div class="space"></div>
				<div class="label checkbox move ${layer.move === undefined ? "" : "checked"}">3D Offset:</div>
				<div class="input_range">
									<input style="z-index: 12;" type="range" min="-500" step="0.1" max="500" name="move">
											<!--	<div class="input_units"><input type="text" name="move" value="${layer.move || 0}" class="small"></div>-->
									</div>
			</div>
			<div class="col">
				<!--<div class="label checkbox step ${layer.step === undefined ? "" : "checked"}">Step:</div>
				<div class="input_units"><input type="text" name="step" value="${layer.step || 1}" min="1" max="100"></div>
				<div class="space"></div>-->
				<div style="font-size:13px;" class="label small">Offset X:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="-500" step="0.1" value="${layerx}" max="500" name="trnsltx">
										<!--	<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;" type="text" class="fourth" value="${layerx}" style="margin-right:16px" name="trnsltx" class="small"></div>-->
									</div>
	
		<div style="font-size:13px;" class="label small">Offset Y:</div>
				
					<div class="input_range">
									<input style="z-index: 12;" type="range" min="-500" step="0.1" value="${layery}" max="500" name="trnslty">
										<!--	<div class="input_units"><input style="width: 30px;height: 25px;font-size:10px;" type="text" class="fourth" value="${layery}" name="trnslty" class="small"></div>-->
									</div>
				

				<!--<div class="label checkbox blur ${layer.blur === undefined ? "" : "checked"}">Blur:</div>
				<div class="input_units"><input type="text" name="blur" min="0" max="1000" value="${layer.blur || 0}"><span>px</span></div>
				<div class="space"></div>-->
				<div style="font-size:12px;white-space: nowrap;" class="label small checkbox movez ${layer.movez === undefined ? "" : "checked"}">Priority:</div>
				<div style="bottom:115px;" class="input_units"><input type="text" name="movez" min="-50" max="50" value="${layer.movez === undefined ? 0 : layer.movez}"  class="small"></div>
			</div>
		</div>
		<!--<div class="space"></div>
		<div class="label checkbox mirror ${layer.mirror ? "checked" : ""}">Reflect horizontally</div>-->
		<div class="space"></div>
		<div class="label checkbox mirror1 ${layer.mirror1 ? "checked" : ""}">Reflect vertically</div>
		<!--<br>
		<div class="label checkbox showhidenext gradient">Gradient</div>
		<div class="hidden gradientcontroller"></div>
		<br>
		<div class="upload">
			<div class="btn file"><span class="fontello" style="margin-right:5px;">^</span> Upload image<input type='file'/></div>
			<div class="btn fontello" style="display:none;">r</div>
			<div class="label">* Image not selected</div>
		</div>-->
	</div>
	</div>
	</div>
	<br>
	`;

	let fontfillstyles = layer.fontfill || {};

	let fontfillcolor = fontfillstyles.color === undefined ? "#33BBFF" : fontfillstyles.color.updateHex();
	let fontfillopacity = fontfillstyles.opacity === undefined ? 1 : fontfillstyles.opacity;
	let fontfillcolorend = fontfillstyles.colorend === undefined ? "#2299DD" : fontfillstyles.colorend.updateHex();
	let fontfillcolorendon = fontfillstyles.colorend !== undefined;

	let fontfillhtml = `
	<div class="section opened">
	
		<div class="layersparamcolorsymbol" id="layersparamcolorsymbol" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcolorsymbol');"></div>
	
	<div hidden class="section_title"><span></span> Fill text</div>
	<div class="section_content fontfill">
	
	
	
	
	
<div class="table-responsive"><table>
	<tbody>
		<tr>
			<td>		<div class="label inlineleft color checkbox ${fontfillstyles.color === undefined ? "" : "checked"}">Color: </div></td>
			<td>		<div class="input_color"><input type="color" name="color" value="${fontfillcolor}" style="background:${fontfillcolor};"></div></td>
		</tr>
		<tr>
			<td>	<div class="label inlineleft checkbox opacity ${fontfillstyles.opacity === undefined ? "" : "checked"}">Transparence: </div></td>
			<td><input type="text" class="fourth" style="margin-left:15px;" min="0" max="1" value="${fontfillopacity}" name="opacity"class="small" ></td>
		</tr>
		<tr>
			<td>		<div class="label checkbox inlineleft colorend ${fontfillcolorendon?"checked":""}">Additional color</div></td>
			<td>	<div class="input_color"><input type="color" name="colorend" value="${fontfillcolorend}" style="background:${fontfillcolorend};"></div></td>
		</tr>
		
		
		<tr>
			<td>		<div style="top:0px;">
			
		
						  
								<div  class="label checkbox showhidenext gradient">Gradient</div>
							   
							    
							    			 <div class="bgcolorstextsymbol" id="bgcolorstextsymbol" style="display:none;">
 <div class="fa fa-times-circle" style="z-index: 112;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorstextsymbol');"></div>

 <div class="gradientcontroller" style="top:310px"></div>
	

          </div>
							                   
							
							
							</div>
		</td>
			<td>	 <div class="btn smallui"   href="javascript:void(0);" onclick="viewdiv('bgcolorstextsymbol');">Color Gradient</div></td>
		</tr>
		
	</tbody>
</table></div>
	
	

  			

	
	

	
	<!--	<div class="iconhelp" title="Color of the last repetition if the number of repetitions is greater than 1">?</div>-->

	
	</div>
	</div>
	</div>
	<br>
	`;
	
	let strokestyle = layer.fontstroke || {};
	let fontstrokecolor = strokestyle.color === undefined ? "#BBDDFF" : strokestyle.color.updateHex();
	let fontstrokeopacity = strokestyle.opacity === undefined ? 1 : strokestyle.opacity;
	let fontstrokecolorend = strokestyle.colorend === undefined ? "#668899" : strokestyle.colorend.updateHex();
	let fontstrokecolorendon = strokestyle.colorend !== undefined;
	let fontstrokesize = strokestyle.size || 0;

	let fontstrokehtml = `
	<div class="section opened">
	
	<div class="layersparamcoloroutsymbol" id="layersparamcoloroutsymbol" style="display:none;">
  <div class="fa fa-times-circle" style="z-index: 122;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('layersparamcoloroutsymbol');"></div>
	
	
	<div hidden class="section_title"><span></span> Text outline</div>
	<div class="section_content fontstroke">
	
	
<div class="table-responsive"><table>
	<tbody>
		<tr>
			<td>	<div class="label inlineleft checkbox size ${strokestyle.size === undefined ? "" : "checked"}">Size:</div></td>
			<td>	<div class="input_units"><input type="text" name="size" class="small"  min="0" max="500" value="${fontstrokesize || 0}"><span></span></div></td>
		</tr>
		<tr>
			<td>	<div class="label inlineleft checkbox color ${strokestyle.color === undefined ? "" : "checked"}">Color:</div></td>
			<td>	<div class="input_color"><input type="color" name="color" value="${fontstrokecolor}" style="background:${fontstrokecolor};"></div></td>
		</tr>
		<tr>
			<td>	<div class="label inlineleft checkbox opacity ${strokestyle.opacity === undefined ? "" : "checked"}">Transparence</div></td>
			<td>	<input type="text" class="fourth" style="margin-left:15px;" min="0" max="1" value="${fontstrokeopacity}" name="opacity"></td>
		</tr>
		
		<tr>
			<td><div class="label checkbox inlineleft colorend ${fontstrokecolorendon?"checked":""}">Additional color</div></td>
			<td>	<div class="input_color"><input type="color" name="colorend" value="${fontstrokecolorend}" style="background:${fontstrokecolorend};"></div></td>
		</tr>
		
		
		
			<tr>
			<td>		<div style="top:0px;">
			
		
						  
								<div  class="label checkbox showhidenext gradient">Gradient</div>
							   
							    
							    			 <div class="bgcolorstextsymbolout" id="bgcolorstextsymbolout" style="display:none;">
 <div class="fa fa-times-circle" style="z-index: 112;position:fixed;color: #D4D4DC;top:5px;right:5px;"  href="javascript:void(0);" onclick="viewdiv('bgcolorstextsymbolout');"></div>

 <div class="gradientcontroller" style="top:310px"></div>
	

          </div>
							                   
							
							
							</div>
		</td>
			<td>	 <div class="btn smallui"   href="javascript:void(0);" onclick="viewdiv('bgcolorstextsymbolout');">Color Gradient</div></td>
		</tr>
		
	</tbody>
</table></div>
	
	
	
		
	
	
	
		
	
	

		
	
	<!--	<div class="iconhelp" title="Color of the last repetition if the number of repetitions is greater than 1">?</div>-->

	
	</div>
	</div>
		</div>
	`;

	container.innerHTML = `
	<br><br>

	${layerparamshtml}

	${fontfillhtml}

	${fontstrokehtml}

	`;
	
	let sections = container.querySelectorAll(".section");
	for (let i = 0; i < sections.length; i++) {
		mySection(sections[i], sidebar);
	}

	let checkboxes = container.querySelectorAll(".label.checkbox");
	for (let i = 0; i < checkboxes.length; i++) {
		labelCheckbox(checkboxes[i]);
	}

	let colorinputs = container.querySelectorAll(".input_color input");
	for (let i = 0; i < colorinputs.length; i++) {
		colorPicker(colorinputs[i]);
	}

	let layerparamsdom = container.querySelector(".layerparams");
	let fontfilldom = container.querySelector(".fontfill");
	let fontstrokedom = container.querySelector(".fontstroke");

	let grdc, grddom, grdcheckbox;
	/*
	grdcheckbox = layerparamsdom.querySelector(".label.checkbox.gradient");
	grddom = layerparamsdom.querySelector(".gradientcontroller");
	grdc = new GradientController();

	grdc.createDom(grddom);
	grdc.onchange = function(){
		if (layer.gradient) {
			layer.gradient = this.data;
			needdrawlc = true;
			draw();
		}
	}

	if (layer.gradient) {
		grdcheckbox.set(true);
		grdc.data = clone(layer.gradient);
		grdc.createDom(grddom);
	}

	let layergrdc = grdc;
	grdcheckbox.onchange = function(){
		if (this.checked) layer.gradient = layergrdc.data;
		else if (layer.gradient) delete layer.gradient;
		needdrawlc = true;
		draw();
	}
	*/

	grdcheckbox = fontfilldom.querySelector(".label.checkbox.gradient");
	grddom = fontfilldom.querySelector(".gradientcontroller");
	grdc = new GradientController();
	grdc.canbeglobal = true;

	grdc.createDom(grddom);
	grdc.onchange = function(){
		if (layer.fontfill && layer.fontfill.gradient) {
			layer.fontfill.gradient = this.data;
			needdrawlc = true;
			draw();
		}
	}

	if (layer.fontfill && layer.fontfill.gradient) {
		grdcheckbox.set(true);
		grdc.data = clone(layer.fontfill.gradient);
		grdc.createDom(grddom);
	}

	let fontfillgrdc = grdc;
	grdcheckbox.onchange = function(){
		if (this.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.gradient = fontfillgrdc.data;
		} else if (layer.fontfill && layer.fontfill.gradient) delete layer.fontfill.gradient;
		needdrawlc = true;
		draw();
	}

	
	grdcheckbox = fontstrokedom.querySelector(".label.checkbox.gradient");
	grddom = fontstrokedom.querySelector(".gradientcontroller");
	grdc = new GradientController();
	grdc.canbeglobal = true;

	grdc.createDom(grddom);
	grdc.onchange = function(){
		if (layer.fontstroke && layer.fontstroke.gradient) {
			layer.fontstroke.gradient = this.data;
			needdrawlc = true;
			draw();
		}
	}

	if (layer.fontstroke && layer.fontstroke.gradient) {
		grdcheckbox.set(true);
		grdc.data = clone(layer.fontstroke.gradient);
		grdc.createDom(grddom);
	}

	let fontstrokegrdc = grdc;
	grdcheckbox.onchange = function(){
		if (this.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.gradient = fontstrokegrdc.data;
		} else if (layer.fontstroke && layer.fontstroke.gradient) delete layer.fontstroke.gradient;
		needdrawlc = true;
		draw();
	}

	/*layerparamsdom.querySelector(".label.mirror").onchange = function(){
		if (this.checked) {
			layer.mirror = 1
		} else {
			if (layer.mirror !== undefined) delete layer.mirror;
		}
		needdrawlc = true;
		draw();
	}*/

	layerparamsdom.querySelector(".label.mirror1").onchange = function(){
		if (this.checked) {
			layer.mirror1 = 1
		} else {
			if (layer.mirror1 !== undefined) delete layer.mirror1;
		}
		needdrawlc = true;
		draw();
	}

	let nrepeatschb = layerparamsdom.querySelector(".label.nrepeats");
	let nrepeatsinp = layerparamsdom.querySelector("input[name=nrepeats]");

	nrepeatschb.onchange = function(){
		if (this.checked) {
			layer.n = checkMinMax(nrepeatsinp);
		} else {
			if (layer.n !== undefined) delete layer.n;
		}
		needdrawlc = true;
		draw();
	}
	nrepeatsinp.onchange = function(){
		if (nrepeatschb.checked) {
			layer.n = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}

	let movechb = layerparamsdom.querySelector(".label.move");
	let moveinp = layerparamsdom.querySelector("input[name=move]");

	movechb.onchange = function(){
		if (this.checked) {
			layer.move = parseInt(moveinp.value) || 0;
		} else {
			if (layer.move !== undefined) delete layer.move;
		}
		needdrawlc = true;
		draw();
	}
	moveinp.onchange = function(){
		if (movechb.checked) {
			layer.move = parseInt(moveinp.value) || 0;
			needdrawlc = true;
			draw();
		}
	}

	/*let opacitychb = layerparamsdom.querySelector(".label.opacity");
	let opacityinp = layerparamsdom.querySelector("input[name=opacity]");

	opacitychb.onchange = function(){
		if (this.checked) {
			layer.opacity = checkMinMax(opacityinp);
		} else {
			if (layer.opacity !== undefined) delete layer.opacity;
		}
		needdrawlc = true;
		draw();
	}
	opacityinp.onchange = function(){
		if (opacitychb.checked) {
			layer.opacity = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}*/

	layerparamsdom.querySelector("input[name=volumerotate]").onchange = function(){
		let val = checkMinMax(this);
		if (val) layer.volumerotate = val;
		else if (layer.volumerotate !== undefined) delete layer.volumerotate;
		needdrawlc = true;
		draw();
	}

	/*let stepchb = layerparamsdom.querySelector(".label.step");
	let stepinp = layerparamsdom.querySelector("input[name=step]");

	stepchb.onchange = function(){
		if (this.checked) {
			layer.step = checkMinMax(stepinp);
		} else {
			if (layer.step !== undefined) delete layer.step;
		}
		needdrawlc = true;
		draw();
	}
	stepinp.onchange = function(){
		if (stepchb.checked) {
			layer.step = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}*/

	let trnsltxinp = layerparamsdom.querySelector("input[name=trnsltx]");
	let trnsltyinp = layerparamsdom.querySelector("input[name=trnslty]");

	let trnsltchange = function(){
		let x = checkMinMax(trnsltxinp);
		let y = checkMinMax(trnsltyinp);
		if (!x && !y) {
			if (layer.translate) delete layer.translate;
		} else {
			layer.translate = new Vec(x,y);
		}
		needdrawlc = true;
		draw();
	}

	trnsltxinp.onchange = trnsltchange;
	trnsltyinp.onchange = trnsltchange;

	/*let blurchb = layerparamsdom.querySelector(".label.blur");
	let blurinp = layerparamsdom.querySelector("input[name=blur]");

	blurchb.onchange = function(){
		if (this.checked) {
			layer.blur = checkMinMax(blurinp);
		} else {
			if (layer.blur !== undefined) delete layer.blur;
		}
		needdrawlc = true;
		draw();
	}
	blurinp.onchange = function(){
		if (blurchb.checked) {
			layer.blur = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}*/

	let movezchb = layerparamsdom.querySelector(".label.movez");
	let movezinp = layerparamsdom.querySelector("input[name=movez]");

	movezchb.onchange = function(){
		if (this.checked) {
			layer.movez = Math.round(checkMinMax(movezinp));
		} else {
			if (layer.movez !== undefined) delete layer.movez;
		}
		needdrawlc = true;
		draw();
	}
	movezinp.onchange = function(){
		if (movezchb.checked) {
			layer.movez = Math.round(checkMinMax(this));
			needdrawlc = true;
			draw();
		}
	}

	let fcolorchb = fontfilldom.querySelector(".label.color");
	let fcolorinp = fontfilldom.querySelector("input[name=color]");

	fcolorchb.onchange = function(){
		if (this.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.color = new MyColor(fcolorinp.value);
		} else {
			if (layer.fontfill && layer.fontfill.color) delete layer.fontfill.color;
		}
		needdrawlc = true;
		draw();
	}
	fcolorinp.onchange = function(){
		if (fcolorchb.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.color = new MyColor(this.value);
			needdrawlc = true;
			draw();
		}
	}

	let fopacitychb = fontfilldom.querySelector(".label.opacity");
	let fopacityinp = fontfilldom.querySelector("input[name=opacity]");

	fopacitychb.onchange = function(){
		if (this.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.opacity = checkMinMax(fopacityinp);
		} else {
			if (layer.fontfill && layer.fontfill.opacity !== undefined) delete layer.fontfill.opacity;
		}
		needdrawlc = true;
		draw();
	}
	fopacityinp.onchange = function(){
		if (fopacitychb.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.opacity = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}

	let ffce = fontfilldom.querySelector("input[name=colorend]");
	let ffcecb = fontfilldom.querySelector(".label.checkbox.colorend");
	ffcecb.onchange = function(){
		if (this.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.colorend = new MyColor(ffce.value);
		} else {
			if (layer.fontfill && layer.fontfill.colorend) delete layer.fontfill.colorend;
		}
		
		needdrawlc = true;
		draw();
	}
	ffce.onchange = function(){
		if (ffcecb.checked) {
			if (!layer.fontfill) layer.fontfill = {};
			layer.fontfill.colorend = new MyColor(this.value);
			needdrawlc = true;
			draw();
		}
	}

	////// stroke

	let ssizechb = fontstrokedom.querySelector(".label.size");
	let ssizeinp = fontstrokedom.querySelector("input[name=size]");

	ssizechb.onchange = function(){
		if (this.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.size = checkMinMax(ssizeinp);
		} else {
			if (layer.fontstroke && layer.fontstroke.size !== undefined) delete layer.fontstroke.size;
		}
		needdrawlc = true;
		draw();
	}
	ssizeinp.onchange = function(){
		if (ssizechb.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.size = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}

	//

	let scolorchb = fontstrokedom.querySelector(".label.color");
	let scolorinp = fontstrokedom.querySelector("input[name=color]");

	scolorchb.onchange = function(){
		if (this.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.color = new MyColor(scolorinp.value);
		} else {
			if (layer.fontstroke && layer.fontstroke.color) delete layer.fontstroke.color;
		}
		needdrawlc = true;
		draw();
	}
	scolorinp.onchange = function(){
		if (scolorchb.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.color = new MyColor(this.value);
			needdrawlc = true;
			draw();
		}
	}

	let sopacitychb = fontstrokedom.querySelector(".label.opacity");
	let sopacityinp = fontstrokedom.querySelector("input[name=opacity]");

	sopacitychb.onchange = function(){
		if (this.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.opacity = checkMinMax(sopacityinp);
		} else {
			if (layer.fontstroke && layer.fontstroke.opacity !== undefined) delete layer.fontstroke.opacity;
		}
		needdrawlc = true;
		draw();
	}
	sopacityinp.onchange = function(){
		if (sopacitychb.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.opacity = checkMinMax(this);
			needdrawlc = true;
			draw();
		}
	}

	let fsce = fontstrokedom.querySelector("input[name=colorend]");
	let fscecb = fontstrokedom.querySelector(".label.checkbox.colorend");
	fscecb.onchange = function(){
		if (this.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.colorend = new MyColor(fsce.value);
		} else {
			if (layer.fontstroke && layer.fontstroke.colorend) delete layer.fontstroke.colorend;
		}
		needdrawlc = true;
		draw();
	}
	fsce.onchange = function(){
		if (fscecb.checked) {
			if (!layer.fontstroke) layer.fontstroke = {};
			layer.fontstroke.colorend = new MyColor(this.value);
			needdrawlc = true;
			draw();
		}
	}
}

function initUI() {



	mydom.scaleinp.onchange = function(){
		let val = checkMinMax(this);
		if (!this.valueIncorrect) {
			lettering.scale = val / 100;
			if (lettering.bg.image && lettering.bg.image.prepared) delete lettering.bg.image.prepared;
			for (let i = 0; i < lettering.layers.length; i++) {
				let layer = lettering.layers[i];
				if (layer.image && layer.image.prepared) delete layer.image.prepared;
 			}
			needdrawlc = true;
			draw();
		}
	}
	
	mydom.scalesub.onclick = function(){
		let val = checkMinMax(mydom.scaleinp);
		if (mydom.scaleinp.valueIncorrect) val = 50;
		val = Math.round(val / 5) * 5;
		val -= 5;
		mydom.scaleinp.value = val;
		mydom.scaleinp.onchange();
	}

	mydom.scaleadd.onclick = function(){
		let val = checkMinMax(mydom.scaleinp);
		if (mydom.scaleinp.valueIncorrect) val = 50;
		val = Math.round(val / 5) * 5;
		val += 5;
		mydom.scaleinp.value = val;
		mydom.scaleinp.onchange();
	}

	mydom.bgimginp.onupload = function(){
		lettering.bg.image = {
			img: this.img,
			name: this.filename
		};
		draw();
	}

	mydom.bgimginp.onclear = function(){
		delete lettering.bg.image;
		draw();
	}

	labelCheckbox(mydom.bggrdcheckbox);

	let bggrdc = new GradientController();
	bggrdc.createDom(mydom.bggrdcheckbox.nextElementSibling);
	bggrdc.onchange = function(){
		if (lettering.bg.gradient) {
			lettering.bg.gradient = this.data;
			draw();
		}
	}

	mydom.bggrdcheckbox.onchange = function(){
		if (this.checked) lettering.bg.gradient = bggrdc.data;
		else if (lettering.bg.gradient) delete lettering.bg.gradient;
		draw();
	}

	mydom.bgcolorinp.onchange = function(){
		lettering.bg.color = this.value;
		if (!lettering.bg.gradient && (!lettering.bg.image || !lettering.bg.image.img)) draw();
	}

	mydom.bgopacityinp.onchange = function(){
		lettering.bg.opacity = checkMinMax(this);
		draw();
	}

	mydom.applysizebtn.onclick = function(){
		let w = checkMinMax(mydom.winp);
		let h = checkMinMax(mydom.hinp);
		lettering.w = w;
		lettering.h = h;
		lettering.needUpdatePositions = true;
		needdrawlc = true;
		if (lettering.bg.image && lettering.bg.image.prepared) delete lettering.bg.image.prepared;
		draw();
	}

	// lettering bg data to ui:

	mydom.winp.value = lettering.w;
	mydom.hinp.value = lettering.h;
	mydom.bgcolorinp.value = lettering.bg.color;
	mydom.bgopacityinp.value = lettering.bg.opacity === undefined ? 1 : lettering.bg.opacity;
	if (lettering.bg.gradient) {
		mydom.bggrdcheckbox.set(true);
		bggrdc.data = clone(lettering.bg.gradient);
		bggrdc.createDom(mydom.bggrdcheckbox.nextElementSibling);
	}
	if (lettering.bg.image && lettering.bg.image.name && lettering.bg.image.path) {
		let img = document.createElement("img");
		img.onload = function(){
			lettering.bg.image.img = this;
			mydom.bgimginp.label.innerHTML = lettering.bg.image.name;
			mydom.bgimginp.rembtn.style.display = "";
			draw();
		}
		img.setAttribute("src", lettering.bg.image.path + lettering.bg.image.name);
	}

	// main parameters:

	let fontopts = mydom.fontfamily.querySelectorAll(".drop span");
	for (let i = 0; i < fontopts.length; i++) {
		let foo = fontopts[i];
		foo.style.fontFamily = "'" + foo.dataset.val + "'";
		foo.style.fontSize = "14pt";
	}

	mydom.textarea.value = lettering.text;
	mydom.inptextx.myrange.value = mydom.inptextx.value = lettering.x*100;
	mydom.inptexty.myrange.value = mydom.inptexty.value = lettering.y*100;
	mydom.inprotate.myrange.value = mydom.inprotate.value = lettering.rotate || 0;
	mydom.inpaxisangle.myrange.value = mydom.inpaxisangle.value = lettering.axisangle || 0;
	mydom.inpaxisrotate.myrange.value = mydom.inpaxisrotate.value = lettering.axisrotate || 0;
	mydom.fontfamily.setValue(lettering.fontfamily);
	mydom.textstyle.setValue(lettering.fontstyle);
	mydom.textalign.setValue(lettering.align);
	mydom.inpfontsize.value = lettering.fontsize;
	mydom.inpletterspace.value = lettering.letterspace;
	mydom.inplineheight.value = lettering.lineheight;
	mydom.linejoin.setValue(lettering.linejoin || "miter5");
	labelCheckbox(mydom.volumedircheckbox);
	if (lettering.layersDirection) {
		mydom.volumedircheckbox.set(true);

		let v = new Vec(1,0);
		let v1 = new Vec(0,1);
		let dot1 = v.dot(lettering.layersDirection);
		let dot2 = v1.dot(lettering.layersDirection);
		let angle = raddeg(Math.acos(dot1));
		if (dot2 < 0) angle *= -1;
		mydom.volumedir.myrange.value = mydom.volumedir.value = angle;
	} else {
		mydom.volumedircheckbox.set(false);
	}

	mydom.textarea.onchange = function(){
		let realchars = this.value.split('').filter(function(e){return e != " " && e != "\n" && e.length;});
		lettering.text = this.value;
		needdrawlc = true;

		if (realchars.length < lettering.letterstyles.length) {
			lettering.letterstyles.splice(realchars.length, lettering.letterstyles.length-realchars.length);
		}

		draw();

		mydom.selectlistlayers.resetSelect();
		mydom.selectlistletters.resetSelect();
		mydom.selectlistletters.set(realchars);
		mydom.uicontainer.classList.add("hidden");
		mydom.btnremlayer.classList.add("inactive");
		mydom.btncopylayer.classList.add("inactive");
		mydom.btntoleftlayer.classList.add("inactive");
		mydom.btntorightlayer.classList.add("inactive");
	}
	mydom.inptextx.myonchange4history = function(val){
		lettering.x = val / 100;
		lettering.needUpdatePositions = true;
		needdrawlc = true;
		movingdata = {};
		draw();
	}
	mydom.inptextx.myonchange = function(val){
		movingdata.x = val / 100;
		draw();
	}
	mydom.inptexty.myonchange4history = function(val){
		lettering.y = val / 100;
		lettering.needUpdatePositions = true;
		needdrawlc = true;
		movingdata = {};
		draw();
	}
	mydom.inptexty.myonchange = function(val){
		movingdata.y = val / 100;
		draw();
	}
	mydom.inprotate.myonchange = function(val){
		movingdata.rotate = val;
		draw();
	}
	mydom.inprotate.myonchange4history = function(val){
		lettering.rotate = val;
		lettering.needUpdatePositions = true;
		needdrawlc = true;
		movingdata = {};
		draw();
	}
	mydom.inpaxisangle.myonchange = function(val){
		fast3drotating = true;
		lettering.needUpdatePositions = true;
		lettering.axisangle = val;
		needdrawlc = true;
		draw();
	}
	mydom.inpaxisrotate.myonchange = function(val){
		fast3drotating = true;
		lettering.needUpdatePositions = true;
		lettering.axisrotate = val;
		needdrawlc = true;
		draw();
	}
	mydom.inpaxisangle.myonchange4history = function(val){
		fast3drotating = false;
		lettering.needUpdatePositions = true;
		lettering.axisangle = val;
		needdrawlc = true;
		draw();
	}
	mydom.inpaxisrotate.myonchange4history = function(val){
		fast3drotating = false;
		lettering.needUpdatePositions = true;
		lettering.axisrotate = val;
		needdrawlc = true;
		draw();
	}
	mydom.fontfamily.myoninput = function(val){
		lettering.fontfamily = val;
		lettering.prevtext = "";
		needdrawlc = true;
		draw();
	}
	mydom.uploadfont.onupload = function(){
		let th = this;
		setTimeout(function(){
			lettering.fontfamily = th.fontname;
			lettering.prevtext = "";
			needdrawlc = true;
			draw();
		}, 300);
	}
	mydom.uploadfont.onclear = function(){
		setTimeout(function(){
			lettering.fontfamily = mydom.fontfamily.querySelector(".drop span.cur").dataset.val;
			lettering.prevtext = "";
			needdrawlc = true;
			draw();
		}, 300);
	}
	mydom.textstyle.myoninput = function(val){
		lettering.fontstyle = val;
		lettering.prevtext = "";
		needdrawlc = true;
		draw();
	}
	mydom.textalign.myoninput = function(val){
		lettering.align = val;
		lettering.prevtext = "";
		needdrawlc = true;
		draw();
	}
	mydom.inpfontsize.onchange = function(){
		lettering.fontsize = checkMinMax(this);
		lettering.prevtext = "";
		needdrawlc = true;
		draw();
	}
	mydom.inpletterspace.onchange = function(){
		lettering.letterspace = checkMinMax(this);
		lettering.prevtext = "";
		needdrawlc = true;
		draw();
	}
	mydom.inplineheight.onchange = function(){
		lettering.lineheight = checkMinMax(this);
		lettering.prevtext = "";
		needdrawlc = true;
		draw();
	}
	mydom.linejoin.myoninput = function(val){
		lettering.linejoin = val;
		needdrawlc = true;
		draw();
	}
	mydom.volumedircheckbox.onchange = function(){
		if (!this.checked) {
			delete lettering.layersDirection;
			mydom.volumedir.myonchange = false;
			needdrawlc = true;
			draw();
		} else {
			mydom.volumedir.myonchange = function(val){
				lettering.layersDirection = new Vec(1,0).rotate(val);
				needdrawlc = true;
				draw();
			}
			mydom.volumedir.onchange();
		}
	}

	// layers and letters:

	mydom.selectlistlayers.onchange = function(){
		if (this.selected > 0) mydom.btnremlayer.classList.remove("inactive");
		else mydom.btnremlayer.classList.add("inactive");
	}

	mydom.selectlistlayers.resetSelect();
	mydom.selectlistletters.resetSelect();

	let layersnames = [];
	for (let i = 0; i < lettering.layers.length; i++) layersnames.push(lettering.layers[i].name);

	mydom.selectlistlayers.set(layersnames);
	mydom.selectlistletters.set(lettering.text.split('').filter(function(e){return e != " " && e != "\n" && e.length;}));

	mydom.selectlistlayers.onchange = function(){
		if (this.selected > 0) {
			if (mydom.selectlistletters.selected == -1) mydom.selectlistletters.select(0);
			if (mydom.selectlistletters.selected == 0) showLayerUI(mydom.uicontainer, this.selected);
			else showLetterLayerUI(mydom.uicontainer, mydom.selectlistletters.selected, this.selected);
		} else {
			if (mydom.selectlistletters.selected <= 0) {
				mydom.uicontainer.classList.add("hidden");
				mydom.btnremlayer.classList.add("inactive");
				mydom.btncopylayer.classList.add("inactive");
				mydom.btntoleftlayer.classList.add("inactive");
				mydom.btntorightlayer.classList.add("inactive");
			} else showLetterUI(mydom.uicontainer, mydom.selectlistletters.selected);
		}
	}

	mydom.selectlistletters.onchange = function(){
		if (this.selected > 0) {
			if (mydom.selectlistlayers.selected == -1) mydom.selectlistlayers.select(0);
			if (mydom.selectlistlayers.selected == 0) showLetterUI(mydom.uicontainer, this.selected);
			else showLetterLayerUI(mydom.uicontainer, this.selected, mydom.selectlistlayers.selected);
		} else {
			if (mydom.selectlistlayers.selected <= 0) {
				mydom.uicontainer.classList.add("hidden");
				mydom.btnremlayer.classList.add("inactive");
				mydom.btncopylayer.classList.add("inactive");
				mydom.btntoleftlayer.classList.add("inactive");
				mydom.btntorightlayer.classList.add("inactive");
			} else showLayerUI(mydom.uicontainer, mydom.selectlistlayers.selected);
		}
	}

	mydom.btnremlayer.onclick = function(){
		mydom.uicontainer.classList.add("hidden");
		let layeri = this.dataset.layer-1;
		lettering.layers.splice(layeri, 1);
		for (let i = 0; i < lettering.letterstyles.length; i++) {
			let ls = lettering.letterstyles[i];
			if (ls && ls.layers) {
				if (ls.layers.length > layeri) ls.layers.splice(layeri, 1);
			}
		}
		mydom.selectlistlayers.list.querySelector(".selected").remove();
		mydom.selectlistlayers.selected = -1;
		mydom.selectlistletters.resetSelect();
		mydom.selectlistlayers.update();
		mydom.selectlistletters.update();

		this.classList.add("inactive");
		mydom.btncopylayer.classList.add("inactive");
		mydom.btntoleftlayer.classList.add("inactive");
		mydom.btntorightlayer.classList.add("inactive");

		needdrawlc = true;
		draw();
	}

	mydom.btncopylayer.onclick = function(){
		let layeri = this.dataset.layer-1;
		let newlayer = cloneLetteringData1(lettering.layers[layeri]);
		lettering.layers.splice(layeri+1, 0, newlayer);

		for (let i = 0; i < lettering.letterstyles.length; i++) {
			let ls = lettering.letterstyles[i];
			if (ls && ls.layers) {
				if (ls.layers.length > layeri+1) ls.layers.splice(layeri+1, 0, false);
			}
		}

		let layersnames = [];
		for (let i = 0; i < lettering.layers.length; i++) layersnames.push(lettering.layers[i].name);

		mydom.selectlistlayers.selected = -1;
		mydom.selectlistlayers.set(layersnames);

		mydom.selectlistletters.resetSelect();
		mydom.selectlistletters.update();

		mydom.selectlistlayers.list.querySelectorAll(".item")[layeri+2].onclick();
		needdrawlc = true;
		draw();
	}

	mydom.btntoleftlayer.onclick = function(){
		if (this.dataset.layer <= 1) return;
		let layeri = this.dataset.layer-1;

		let oe = mydom.selectlistlayers.list.querySelector(".selected");
		let be = mydom.selectlistlayers.list.querySelector(".selected").previousElementSibling;

		let o = oe.innerHTML;
		oe.innerHTML = be.innerHTML;
		be.innerHTML = o;

		swapArrayElements(lettering.layers, layeri, layeri-1);

		for (let i = 0; i < lettering.letterstyles.length; i++) {
			let ls = lettering.letterstyles[i];
			if (ls && ls.layers) {
				if (ls.layers.length) swapArrayElements(ls.layers, layeri, layeri-1);
			}
		}

		be.onclick();
		needdrawlc = true;
		draw();
	}

	mydom.btntorightlayer.onclick = function(){
		if (this.dataset.layer >= lettering.layers.length) return;
		let layeri = this.dataset.layer-1;

		let oe = mydom.selectlistlayers.list.querySelector(".selected");
		let be = mydom.selectlistlayers.list.querySelector(".selected").nextElementSibling;

		let o = oe.innerHTML;
		oe.innerHTML = be.innerHTML;
		be.innerHTML = o;

		swapArrayElements(lettering.layers, layeri, layeri+1);

		for (let i = 0; i < lettering.letterstyles.length; i++) {
			let ls = lettering.letterstyles[i];
			if (ls && ls.layers) {
				if (ls.layers.length) swapArrayElements(ls.layers, layeri, layeri+1);
			}
		}

		be.onclick();
		needdrawlc = true;
		draw();
	}

	mydom.btnaddlayer.onclick = function(){
		lettering.layers.push({
			name: "Слой",
			fontfill: {
				color: new MyColor(0x22aaee),
				opacity: 1
			},
			fontstroke: {
				color: new MyColor(0xffffff),
				size: 0
			},
			n: 1,
			move: 0,
			step: 1
		});
		mydom.selectlistlayers.add("Слой");
		mydom.selectlistlayers.update();
	}

	for (let i = 0, n = lettering.layers.length; i < n; i++) {
		let layer = lettering.layers[i];
		if (layer.image && layer.image.name && layer.image.path) {
			let img = document.createElement("img");
			img.onload = function(){
				layer.image.img = this;
				needdrawlc = true;
				draw();
			}
			img.setAttribute("src", layer.image.path + layer.image.name);
		}
	}
}

initUI();
draw();

document.fonts.onloadingdone = function(){
    lettering.prevtext = "";
	needdrawlc = true;
	draw();
};

canvasbar.querySelector(".save").onclick = function(){
	let oldscale = lettering.scale;
	c.style.display = "none";
	lettering.scale = 1;
	if (lettering.bg.image && lettering.bg.image.prepared) delete lettering.bg.image.prepared;
	for (let i = 0; i < lettering.layers.length; i++) {
		let layer = lettering.layers[i];
		if (layer.image && layer.image.prepared) delete layer.image.prepared;
	}
	needdrawlc = true;
	draw();
	c.toBlob(function(b){

		lettering.scale = oldscale;
		if (lettering.bg.image && lettering.bg.image.prepared) delete lettering.bg.image.prepared;
		for (let i = 0; i < lettering.layers.length; i++) {
			let layer = lettering.layers[i];
			if (layer.image && layer.image.prepared) delete layer.image.prepared;
		}
		needdrawlc = true;
		draw();
		c.style.display = "";

		saveBlobAsFile(b, "image.png");
	});
}

canvasbar.querySelector(".redraw").onclick = function(){
	if (lettering.bg.image && lettering.bg.image.prepared) delete lettering.bg.image.prepared;
	for (let i = 0; i < lettering.layers.length; i++) {
		let layer = lettering.layers[i];
		if (layer.image && layer.image.prepared) delete layer.image.prepared;
	}
	lettering.prevtext = "";
	needdrawlc = true;
	movingletterstate = 0;
	needdrawlc1 = -1;
	fast3drotating = false;
	movingletter = -1;
	draw();
}

function cloneLetteringData(obj){
    if (obj == null || typeof(obj) != 'object')
        return obj;
    if (obj.tagName == "CANVAS" || obj.tagName == "IMG") return;
    if (obj.constructor === MyColor) return obj.updateHex();
    var temp = new obj.constructor(); 
    for (var key in obj) {
        temp[key] = cloneLetteringData(obj[key]);
    }
    return temp;
}

function cloneLetteringData1(obj){
    if (obj == null || typeof(obj) != 'object')
        return obj;
    if (obj.tagName == "CANVAS" || obj.tagName == "IMG") return;

    var temp;
    if (obj.constructor === MyColor) {
    	return obj.clone();
    } else {
    	temp = new obj.constructor(); 
    }
    for (var key in obj) {
        temp[key] = cloneLetteringData1(obj[key]);
    }
    return temp;
}

canvasbar.querySelector(".export").onclick = function(){
	let data = cloneLetteringData(lettering);
	data.prevtext = "";
	data.letterssorted = [];
	data.letters = [];
	data.needUpdatePositions = true;
	if (data.autoscale) delete data.autoscale;
	var json = JSON.stringify(data, false, "\t");
	var blob = new Blob([json], {type : 'application/json'});
	saveBlobAsFile(blob, "project_"+myDate()+".json");
}

canvasbar.querySelector(".import").onclick = function(){
	let inpfile = document.getElementById("forimport");
	inpfile.onchange = function(){
	    let reader = new FileReader();
	    reader.onload = function(e){
	    	var filedata = e.target.result;
	    	localStorage.setItem("importopened", filedata);
		    document.location.href = document.location.href;
	    }
	    if (this.files && this.files[0]) {
	        reader.readAsText(this.files[0]);
	    }
	}
	inpfile.click();
}