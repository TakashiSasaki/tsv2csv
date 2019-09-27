
var tsvPlaceholder="researcherId	surName	givenName	flag1	value1\n\
01234567	Ehime	Taro	TRUE	999\n\
987654321	Aidai	Hanako	FALSE	111\n\
";
var csvPlaceholder='researcherId","surName","givenName","flag1","value1"\n\
01234567,Ehime,Taro,"TRUE","999"\n\
987654321,Aidai,Hanako,"FALSE","111"';

var jsonPlaceholder='[["\"researcherId\"","\"surName\"","\"givenName\"","\"flag1\"","\"value1\""],["\"01234567\"","\"Ehime\"","\"Taro\"","\"TRUE\"","\"999\""],["\"987654321\"","\"Aidai\"","\"Hanako\"","\"FALSE\"","\"111\""]]';

document.querySelector("#step1 textarea").setAttribute("placeholder", "例\n"+tsvPlaceholder);
//document.querySelector("#tsvTextarea").value=tsvPlaceholder;
document.querySelector("#step3 textarea").setAttribute("placeholder", "例\n"+csvPlaceholder);
//document.querySelector("#jsonTextarea").setAttribute("placeholder", "例\n"+jsonPlaceholder);
document.querySelector("#step3 input").setAttribute("placeholder", "例 1,2,3");

document.querySelector('#step4 A').onclick = function() {
  var text = document.querySelector('#step3 textarea').value;
  this.href = 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(text);
  var blob = new Blob([text], {type:"text/plain"});
  var objectUrl = URL.createObjectURL(blob);
  this.href = objectUrl;
};
