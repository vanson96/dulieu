var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback, element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function scale(ctx,scale_x,scale_y,x,y){
    ctx.translate(x,y);
    ctx.scale(scale_x,scale_y);
    ctx.translate(-x,-y);
}

function swapArrayElements(a,i,j){
	let o = a[i];
	a[i] = a[j];
	a[j] = o;
}

function loadImg(url, success, progress) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            success(this.result);
        }
        reader.readAsDataURL(xhr.response);
    };

    if (progress !== undefined) {
        var updateProgress = function(e) {
            if (e.lengthComputable) {
                progress(e.loaded, e.total);
            }
        }
        xhr.addEventListener("progress", updateProgress, false);
    }

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

HTMLElement.prototype.click = function() {
   var evt = this.ownerDocument.createEvent('MouseEvents');
   evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
   this.dispatchEvent(evt);
}

function checkMinMax(e) {
    var val = parseFloat(e.value);
    var errors = false;
    
    if (isNaN(val)) {
        val = 0;
        errors = true;
    }

    var min = e.getAttribute("min");
    var max = e.getAttribute("max");

    if (min) {
        min = parseFloat(min);
        if (val < min) {
            val = min;
            e.value = val;
            //errors = true;
        }
    }

    if (max) {
        max = parseFloat(max);
        if (val > max) {
            val = max;
            e.value = val;
            //errors = true;
        }
    }

    if (errors) {
    	e.classList.add("errors");
    	e.valueIncorrect = true;
    } else {
    	e.classList.remove("errors");
    	e.valueIncorrect = false;
    }

    return val;
}

function clone(obj){
    if (obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor(); 
    for (var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

function drawNode(ctx, x, y, r, color, o) {
	ctx.save();
	if (o) ctx.globalAlpha = o;
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x,y,r,0,Math.PI*2,true);
	ctx.fill();
	ctx.restore();
}

function drawSquare(ctx, x, y, r, color, o) {
	ctx.save();
	if (o) ctx.globalAlpha = o;
	ctx.fillStyle = color;
	ctx.fillRect(x-r,y-r,r*2,r*2);
	ctx.restore();
}

function degrad(deg) {

	return deg*Math.PI/180;
}

function raddeg(rad) {

	return rad/Math.PI*180;
}

function rotate(deg, x, y, ctx) {
	ctx.translate(x, y);
	ctx.rotate(degrad(deg));
	ctx.translate(-x, -y);
}

function rotaterad(rad, x, y, ctx) {
	ctx.translate(x, y);
	ctx.rotate(rad);
	ctx.translate(-x, -y);
}

class Vec {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	multMatrix(m) {
		let x = this.x;
		let y = this.y;
		this.x = x * m[0][0] + y * m[0][1];
		this.y = x * m[1][0] + y * m[1][1];
		return this;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	neg() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	len() {
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y, 2));
	}

	len2() {
		return Math.pow(this.x,2) + Math.pow(this.y, 2);
	}

	dot(v) {
		return this.x*v.x + this.y*v.y;
	}

	projectionof (v) {
		this.mult( this.dot(v) / this.len2() );
		return this;
	}

	normalize() {
		var l = this.len();
		this.x /= l;
		this.y /= l;
		return this;
	}

	normal(v0, v1) {
		// perpendicular
		var nx = v0.y - v1.y;
  		var ny = v1.x - v0.x;
		// normalize
		var len = 1.0 / Math.sqrt(nx * nx + ny * ny);
		this.x = nx * len;
		this.y = ny * len;
		return this;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	subcopy (v0, v1) {
		this.x = v0.x - v1.x;
		this.y = v0.y - v1.y;
		return this;
	}

	mult(n) {
		this.x *= n;
		this.y *= n;
		return this;
	}

	rotate(deg) {
		var x = this.x;
		var y = this.y;

		this.x = x * Math.cos(degrad(deg)) - y * Math.sin(degrad(deg));
    	this.y = x * Math.sin(degrad(deg)) + y * Math.cos(degrad(deg));

    	return this;
	}

	cos(v) {
		var b = this.len() * v.len();
		if (b) {
			var a = this.dot(v);
			return a/b;
		} else {
			return false;
		}
	}

	angle(v) {
		return Math.acos(this.cos(v));
	}

	bigangle(v) {
		var c = this.cos(v);
		var a = Math.acos(c);
		if (c < 0) a = -a;
		return a;
	}

	zero() {
		this.x = 0;
		this.y = 0;
		return this;
	}

	print(n) {
		console.log((n || "vec")+": x = "+this.x+"; y = "+this.y);
	}

	scale (v, s) {
		this.x = v.x * s;
		this.y = v.y * s;
		return this;
	}

	perp (v) {
		this.x = -v.y;
		this.y =  v.x;
		return this;
	}

	clone() {
		return new Vec(this.x, this.y);
	}
}

function round(x, e) {
	e = e || 0;
	var m = Math.pow(10,e);
	return Math.round(x*m)/m;
}

function drawPoly(ctx, vs) {
	ctx.fillStyle = "#333";
	ctx.beginPath();
	ctx.moveTo(vs[0].x, vs[0].y);
	for (var i = 1; i < vs.length; i++) ctx.lineTo(vs[i].x, vs[i].y);
	ctx.closePath();
	ctx.fill();
}

class My2List {

	constructor () {
		this.n = 0;
		this.first = false;
		this.last = false;
	}

	addFirst(e){
		if (this.n == 0) {
			this.first = this.last = e;
			this.n = 1;
		} else {
			let old = this.first;
			this.first = e;
			this.first.next = old;
			old.prev = this.first;
			this.n++;
		}
	}

	addLast(e){
		if (this.n == 0) {
			this.first = this.last = e;
			this.n = 1;
		} else {
			let old = this.last;
			this.last = e;
			this.last.prev = old;
			old.next = this.last;
			this.n++;
		}
	}

	remFirst(){
		if (this.n == 1) {
			this.first = this.last = false;
			this.n = 0;
		} else {
			let next = this.first.next;
			this.first = next;
			delete this.first.prev;
			this.n--;
		}
	}

	remLast(){
		if (this.n == 1) {
			this.first = this.last = false;
			this.n = 0;
		} else {
			let prev = this.last.prev;
			this.last = prev;
			delete this.last.next;
			this.n--;
		}
	}
}

class MyColor {

	constructor(c) {
		if (typeof c == "number") {
			this.int = c;
			this.r = (0xFF0000 & c) >> 16;
		    this.g = (0x00FF00 & c) >> 8;
		    this.b = (0x0000FF & c) >> 0;
		} else {
			this.hex = c;
			if (c.length == 7) {
				this.r = parseInt(c.substr(1,2), 16);
				this.g = parseInt(c.substr(3,2), 16);
				this.b = parseInt(c.substr(5,2), 16);
			} else {
				let rstr = c.substr(1,1);
				let gstr = c.substr(2,1);
				let bstr = c.substr(3,1);

				this.r = parseInt(rstr+rstr, 16);
				this.g = parseInt(gstr+gstr, 16);
				this.b = parseInt(bstr+bstr, 16);
			}
			this.int = (this.r << 16) + (this.g << 8) + (this.b << 0);
		}
	}
    
    updateHex() {
        var s = this.int.toString(16);
        var nz = 6 - s.length;
        var z = "";
        for (var i = 0; i < nz; i++) z += "0";
        this.hex = "#" + z + s;
        return this.hex;
    }
    
    rgb() {
    	return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }

    rgba(a) {
    	return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + a + ")";
    }
    
    mix(c, k) {
    	var k1 = 1 - k;
    	this.r = c.r * k + k1 * this.r;
        this.g = c.g * k + k1 * this.g;
        this.b = c.b * k + k1 * this.b;
        
        this.int = (this.r << 16) + (this.g << 8) + (this.b << 0);
        return this;
    }
    
    clone(){
    	var c = new MyColor(this.int);
        return c;
    }
}

function scalePro(scalex, scaley, x, y, ctx) {
	ctx.translate(x, y);
	ctx.scale(scalex, scaley);
	ctx.translate(-x, -y);
}

Object.equals = function( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
}

function rotateMatrix(v, d) {
    let x = v.x;
    let y = v.y;
    let z = v.z;
    let c = 0.0;
    let s = 0.0;
    let c1 = 0.0;
    c = Math.cos(d);
    s = Math.sin(d);
    c1 = 1.0 - c;
    data = [[], [], [], []];

    data[0][0] = c+c1*x*x; data[1][0] = c1*x*y-s*z; data[2][0] = c1*x*z+s*y; data[3][0] = 0.0;
    data[0][1] = c1*x*y+s*z; data[1][1] = c+c1*y*y; data[2][1] = c1*y*z-s*x; data[3][1] = 0.0;
    data[0][2] = c1*x*z-s*y; data[1][2] = c1*y*z+s*x; data[2][2] = c+c1*z*z; data[3][2] = 0.0;
    data[0][3] = 0.0; data[1][3] = 0.0; data[2][3] = 0.0; data[3][3] = 1.0;

    return data;
}

function saveBlobAsFile(blob, filename) {
    var templink = document.createElement("a");
    templink.download = filename;
    templink.href = window.URL.createObjectURL(blob);
    templink.click();
}

function myDate(){
	let d = new Date();
	return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
}