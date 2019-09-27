function startOver(){
  setTimeout(clearTsvTextarea, 200);
  window.location.hash="step1";
}

document.querySelector('#step4 A').onclick = function() {
  var text = document.querySelector('#step3 textarea').value;
  this.href = 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(text);
  var blob = new Blob([text], {type:"text/plain"});
  var objectUrl = URL.createObjectURL(blob);
  this.href = objectUrl;
};

document.querySelector("#downloadShiftJis").onclick=function(){
  var text = document.querySelector('#step3 textarea').value;
  var sjisArray = Encoding.convert(text, {to:'SJIS', type:'array'});
  var sjisUint8Array = Uint8Array.from(sjisArray);
  //console.log(sjis);
  var blob = new Blob([sjisUint8Array], {type:"text/plain; charset=Shift_JIS"});
  var objectUrl = URL.createObjectURL(blob);
  this.href = objectUrl;
};
