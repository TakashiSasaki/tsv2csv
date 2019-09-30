var versionMajor = 0;
var versionMinor = 1;
var revision = 20190930;
    
setTimeout(function(){
  var versionMessage = "←現在表示されているのはこちら（version " + versionMajor + "." + versionMinor + "." + revision + "）です"
  console.log(window.location.host);
  if(window.location.host.match(/.*glitch.*/)){
    document.querySelector("#step0 span.glitch").innerText = versionMessage;
  } else if(window.location.host.match(/.*firebase.*/)){
    document.querySelector("#step0 span.firebase").innerText = versionMessage;
  }//if
});
