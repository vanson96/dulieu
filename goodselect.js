(function(){
  var sels = document.querySelectorAll(".myselect");

  var option_click = function(sel, opt) {
    sel.querySelector(".drop span.cur").classList.remove("cur");
    opt.classList.add("cur");
    sel.querySelector("b").innerHTML = opt.innerHTML;
    if (sel.myoninput) sel.myoninput(opt.dataset.val);
  }

  var select_click = function(sel, e) {
    e.stopPropagation();
    e.preventDefault();

    if (sel.classList.contains("shown")) sel.classList.remove("shown");
    else {
      var drop = sel.querySelector(".drop");
      if (drop.classList.contains("ps")) {
        var cur_opt = drop.querySelector("span.cur");
        var nodes = Array.prototype.slice.call(drop.children);
        var i = nodes.indexOf(cur_opt);
        var toppx = 30 * (i - 3);
        if (toppx < 0) toppx = 0;
        drop.scrollTop = toppx;
      }

      sel.classList.add("shown");
    }

    if (sel.mypscroll) sel.mypscroll.update();

    var shown = document.querySelectorAll(".myselect.shown");
    for (var i = 0; i < shown.length; i++) {
      if (!shown[i].isSameNode(sel)) {
        shown[i].classList.remove("shown");
      }
    }
    return false;
  }

  var doc_click = function(){
    var shown = document.querySelectorAll(".myselect.shown");
    for (var i = 0; i < shown.length; i++) {
      shown[i].classList.remove("shown");
    }
  }

  window.myGoodSelect = function(sel){
      var sel_drop = sel.querySelector(".drop");
      var opts = sel_drop.querySelectorAll("span");
      for (var i = 0; i < opts.length; i++) {
        var opt = opts[i];
        (function(sel, opt){
          opt.addEventListener('click', function(){
            option_click(sel, opt);
          }, false);
        })(sel, opt);
      }

      if (PerfectScrollbar) {
        sel_drop.style.maxHeight = 5 * 30 + "px";
        sel.mypscroll = new PerfectScrollbar(sel_drop);
      }

      sel.addEventListener('click', function(e){
        select_click(sel, e);
      }, false);

      sel.setValue = function(val) {
        var curopt = this.querySelector(".drop span.cur");
        if (curopt) curopt.classList.remove("cur");
        var opts = this.querySelectorAll(".drop span");

        if (val) {
          for (var i = 0; i < opts.length; i++) {
            var cval = opts[i].getAttribute("data-val");
            if (val+"" == cval) {
              opts[i].classList.add("cur");
              this.querySelector("b").innerHTML = opts[i].innerHTML;
            }
          }
        } else {
          opts[0].classList.add("cur");
          this.querySelector("b").innerHTML = opts[0].innerHTML;
        }
      }

      sel.appendOption = function(t, v) {
        var opt = document.createElement("span");
        opt.setAttribute("data-val", v);
        opt.innerHTML = t;

        sel.querySelector(".drop").appendChild(opt);

        (function(sel, opt){
          opt.addEventListener('click', function(){
            option_click(sel, opt);
          }, false);
        })(sel, opt);

        return opt;
      }
    };

  for (var i = 0; i < sels.length; i ++) {
    var sel = sels[i];
    window.myGoodSelect(sel);
  }

  document.addEventListener('click', doc_click, false);
})();