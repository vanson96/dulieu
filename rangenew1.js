function viewdiv(id){
var el=document.getElementById(id);
if(el.style.display=="block"){
el.style.display="none";
} else {
console.log('testversion', id);
if (id == 'mydivstyle') {
console.log('tryopenlink')
window.open("https://en.fonttextup.com/payinvite/pay.php", '_blank').focus();
return;
}
el.style.display="block";
}
}