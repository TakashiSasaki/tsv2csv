
var tsvPlaceholder="researcherId	surName	givenName	flag1	value1\n\
01234567	Ehime	Taro	TRUE	999\n\
987654321	Aidai	Hanako	FALSE	111\n\
";
var csvPlaceholder='researcherId","surName","givenName","flag1","value1"\n\
01234567,Ehime,Taro,"TRUE","999"\n\
987654321,Aidai,Hanako,"FALSE","111"';

var jsonPlaceholder='[["\"researcherId\"","\"surName\"","\"givenName\"","\"flag1\"","\"value1\""],["\"01234567\"","\"Ehime\"","\"Taro\"","\"TRUE\"","\"999\""],["\"987654321\"","\"Aidai\"","\"Hanako\"","\"FALSE\"","\"111\""]]';

document.querySelector("#tsvTextarea").setAttribute("placeholder", "例\n"+tsvPlaceholder);
//document.querySelector("#tsvTextarea").value=tsvPlaceholder;
document.querySelector("#csvTextarea").setAttribute("placeholder", "例\n"+csvPlaceholder);
document.querySelector("#jsonTextarea").setAttribute("placeholder", "例\n"+jsonPlaceholder);
document.querySelector("#numberColumnsInput").setAttribute("placeholder", "例 1,2,3");

document.querySelector('#downloadA').onclick = function() {
    var text = document.querySelector('#csvTextarea').value;
    this.href = 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(text);
    var blob = new Blob([text], {type:"text/plain"});
    var objectUrl = URL.createObjectURL(blob);
    this.href = objectUrl;    
};

function setExample(){
  document.querySelector("#tsvTextarea").value = tsvPlaceholder;
  document.querySelector("#numberColumnsInput").value = "1,5";
  document.querySelector("#hasHeaderInput").checked = true;
}

function clearData(){
  document.querySelector("#tsvTextarea").value = "";
  document.querySelector("#numberColumnsInput").value = "";  
  document.querySelector("#hasHeaderInput").checked = false;
}

var LARGE_EXAMPLE_ROWS=10000;
var LARGE_EXAMPLE_COLUMNS=100;
function setLargeExample(){
  var rows = [];
  for(var i=0; i<LARGE_EXAMPLE_ROWS; ++i){
    var columns = [];
    for(var j=0; j<LARGE_EXAMPLE_COLUMNS; ++j){
      columns.push("row-"+i+"-column-"+ j);
    }//for j
    var row = columns.join("\t");
    rows.push(row);
  }//for i
  var tsv_string = rows.join("\n");
  document.querySelector("#tsvTextarea").value = tsv_string;
  document.querySelector("#numberColumnsInput").value = null;
  document.querySelector("#hasHeaderInput").checked = false;
}//setLargeExample

function setMultipleLinesExample(){
  var rows = [];
  rows.push("col1\tcol2\tcol3");
  rows.push('value211\nvalue212\nvalue213\tvalue22\tvalue23');
  rows.push('value31\t"value321\nvalue322"\tvalue33');
  rows.push('value41\tvalue42\t"value431\nvalue432');
  document.querySelector("#tsvTextarea").value = rows.join("\n");
  document.querySelector("#numberColumnsInput").value = null;
  document.querySelector("#hasHeaderInput").checked = false;
}