function setExample1(){
  if(document.querySelector("#tsvTextarea").readOnly === true) return;
  document.querySelectorAll("#step1 button.example").forEach(x=>x.disabled=true);
  document.querySelector("#tsvTextarea").value = "読み込み中";
  document.querySelector("#nTsvTextLines").value = "読み込み中";
  setTimeout(function(){
  document.querySelector("#tsvTextarea").value = 
    "researcherId	surName	givenName	flag1	value1\n\
01234567	Ehime	Taro	TRUE	999\n\
987654321	Aidai	Hanako	FALSE	111\n\
";
    lockTsvTextarea();
  });
}

var LARGE_EXAMPLE_ROWS=10000;
var LARGE_EXAMPLE_COLUMNS=100;
function setExample2(){
  if(document.querySelector("#tsvTextarea").readOnly === true) return;
  document.querySelectorAll("#step1 button.example").forEach(x=>x.disabled=true);
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
  document.querySelector("#tsvTextarea").value = "読み込み中";
  document.querySelector("#nTsvTextLines").value = "読み込み中";
  setTimeout(function(){
    document.querySelector("#tsvTextarea").value = tsv_string;
    lockTsvTextarea();
  });
}//setLargeExample

function setExample3(){
  if(document.querySelector("#tsvTextarea").readOnly === true) return;
  document.querySelectorAll("#step1 button.example").forEach(x=>x.disabled=true);
  var rows = [];
  var example3 = 'col1\tcol\tcol3\n\
"value211\n\
value212\n\
value213"\tvalue22\tvalue23\n\
value31\t"value321\n\
value322"\tvalue33\n\
value41\tvalue42\t"value431\n\
value432"\n\
';

  document.querySelector("#tsvTextarea").value = example3;
  document.querySelector("#tsvTextarea").readOnly = true;
  document.querySelector("#tsvTextarea").classList.add("yellow");
  document.querySelector("#nTsvTextLines").value = "読み込み中";
  lockTsvTextarea();
}

var example4 = '"""\t""\t"""\n\
"""\t""\t"""\n\
';

function setExample4(){
  if(document.querySelector("#tsvTextarea").readOnly === true) return;
  document.querySelectorAll("#step1 button.example").forEach(x=>x.disabled=true);
  document.querySelector("#tsvTextarea").value = example4;  
  document.querySelector("#nTsvTextLines").value = "読み込み中";
  lockTsvTextarea();
}//setExample4

function lockTsvTextarea(){
  document.querySelector("#tsvTextarea").readOnly = true;
  document.querySelector("#tsvTextarea").classList.add("yellow");
  var tsvText = document.querySelector("#tsvTextarea").value;
  var tsvLines = tsvText.split("\n");
  document.querySelector("#nTsvTextLines").value = tsvLines.length;
  document.querySelector("#nTsvTextLines").classList.add("yellow");
  document.querySelector("#step2 button").disabled = false;
}

function clearTsvTextarea(){
  parserResult = undefined;
  document.querySelector("#tsvTextarea").value = "";
  document.querySelector("#tsvTextarea").readOnly = false;
  document.querySelector("#tsvTextarea").classList.remove("yellow");
  document.querySelector("#nTsvTextLines").value = "";
  document.querySelector("#nTsvTextLines").classList.remove("yellow");  
  document.querySelectorAll("button.example").forEach(x=>x.disabled=false);
  document.querySelector('#step2 table').innerText = null;
  document.querySelector("#step2 .chart").innerText = null;
  document.querySelector("#step2 p.caution").classList.add("hidden");
  document.querySelector("#step2 button").disabled = true;
  document.querySelector("#step3 button").disabled = true;
}
