(function(root){
'use strict';

function parseHex(input){
  var h=String(input).trim().replace(/^#/,'');
  if(/^[0-9a-f]{3}$/i.test(h)) h=h.split('').map(function(c){return c+c;}).join('');
  if(!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [0,2,4].map(function(i){return parseInt(h.slice(i,i+2),16);});
}

// WCAG 2.x relative luminance (sRGB). Threshold 0.04045 per the sRGB spec;
// WCAG 2.x text historically lists 0.03928, which gives identical results for 8-bit values.
function channel(v){
  var c=v/255;
  return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4);
}
function luminance(rgb){
  return 0.2126*channel(rgb[0])+0.7152*channel(rgb[1])+0.0722*channel(rgb[2]);
}
function ratio(rgb1,rgb2){
  var a=luminance(rgb1),b=luminance(rgb2);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}

// Never round up: 4.499 must fail 4.5.
function floor2(n){return Math.floor(n*100)/100;}

var CHECKS=[
  {id:'1.4.3 Contrast (Minimum), normal text',level:'AA',min:4.5},
  {id:'1.4.3 Contrast (Minimum), large text',level:'AA',min:3},
  {id:'1.4.6 Contrast (Enhanced), normal text',level:'AAA',min:7},
  {id:'1.4.6 Contrast (Enhanced), large text',level:'AAA',min:4.5},
  {id:'1.4.11 Non-text Contrast, UI components and graphics',level:'AA',min:3}
];

function evaluate(r){
  return CHECKS.map(function(c){return {id:c.id,level:c.level,min:c.min,pass:r>=c.min};});
}

var api={parseHex:parseHex,luminance:luminance,ratio:ratio,floor2:floor2,evaluate:evaluate};
if(typeof module!=='undefined'&&module.exports) module.exports=api;
root.Contrast=api;

if(typeof document==='undefined') return;

var $=function(id){return document.getElementById(id);};
var fgHex=$('fg-hex'),bgHex=$('bg-hex'),fgPick=$('fg-pick'),bgPick=$('bg-pick');

function normalize(v){return v.charAt(0)==='#'?v:'#'+v;}

function update(){
  var fg=parseHex(fgHex.value),bg=parseHex(bgHex.value);
  $('fg-err').textContent=fg?'':'Enter a valid hex color, e.g. #1A1A1A.';
  $('bg-err').textContent=bg?'':'Enter a valid hex color, e.g. #FFFFFF.';
  fgHex.setAttribute('aria-invalid',String(!fg));
  bgHex.setAttribute('aria-invalid',String(!bg));
  if(!fg||!bg) return;
  var r=ratio(fg,bg);
  $('ratio').textContent=floor2(r).toFixed(2)+':1';
  var p=$('preview');
  p.style.color=normalize(fgHex.value);
  p.style.background=normalize(bgHex.value);
  var body=$('results');
  body.textContent='';
  evaluate(r).forEach(function(e){
    var tr=document.createElement('tr');
    [e.id+' (Level '+e.level+')',e.min+':1'].forEach(function(t){
      var td=document.createElement('td');td.textContent=t;tr.appendChild(td);
    });
    var td=document.createElement('td');
    td.className=e.pass?'pass':'fail';
    td.textContent=e.pass?'Pass':'Fail';
    tr.appendChild(td);body.appendChild(tr);
  });
}

function link(hexEl,pickEl){
  hexEl.addEventListener('input',function(){
    var rgb=parseHex(hexEl.value);
    if(rgb) pickEl.value='#'+rgb.map(function(v){return ('0'+v.toString(16)).slice(-2);}).join('');
    update();
  });
  pickEl.addEventListener('input',function(){hexEl.value=pickEl.value.toUpperCase();update();});
}
link(fgHex,fgPick);link(bgHex,bgPick);

$('swap').addEventListener('click',function(){
  var t=fgHex.value;fgHex.value=bgHex.value;bgHex.value=t;
  fgPick.value=normalize(fgHex.value).toLowerCase();
  bgPick.value=normalize(bgHex.value).toLowerCase();
  update();
});

update();
})(typeof window!=='undefined'?window:globalThis);
