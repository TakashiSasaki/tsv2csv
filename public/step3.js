var csvPlaceholder='researcherId","surName","givenName","flag1","value1"\n\
01234567,Ehime,Taro,"TRUE","999"\n\
987654321,Aidai,Hanako,"FALSE","111"';
document.querySelector("#step3 textarea").setAttribute("placeholder", "例\n"+csvPlaceholder);
document.querySelector("#step3 input").setAttribute("placeholder", "例 1,2,3");

function onCreateCsvButtonClick(){
  if(parserResult === undefined || parserResult === null) return;
  var x = document.querySelector("#step3 input").value.split(",");
  var numberColumns = [];
  for(var i in x){
    var y = parseInt(x[i]);
    if(isNaN(y)) continue;
    numberColumns.push(y);
  }//for
  setTimeout(function(){createCsv(numberColumns);});
}

function createCsv(numberColumns){
  var csvRows = [];
  for(var j=0; j<parserResult.value.length; ++j){
    if(parserResult.value[j].length===0) continue;
    //var tsvColumns = tsvRow.split("\t");
    var csvColumns = [];
    if(j===0 && document.querySelector("#step3 input[type='checkbox']").checked){
      for(var k=0; k < parserResult.value[j].length; ++k){
        csvColumns.push('"'+parserResult.value[j][k]+'"');
      }//for
      csvRows.push(csvColumns);
      continue;
    }//if
    for(var k=0; k < parserResult.value[j].length; ++k){
      if(numberColumns.indexOf(k+1) >= 0){
        csvColumns.push(parserResult.value[j][k]);
      } else {
        var escaped = parserResult.value[j][k].replace('"', '""');
        csvColumns.push('"' + escaped + '"');
      }//if
    }//for
    csvRows.push(csvColumns);
  }//for
  setTimeout(function(){emitCsv(csvRows);});
}//createCsv

function emitCsv(csvRows){
  var csvRowStrings = [];
  for(var i=0; i<csvRows.length; ++i){
      var csvRowString = csvRows[i].join(",");
      csvRowStrings.push(csvRowString);
  }//for
  var csvString = csvRowStrings.join("\n");
  document.querySelector("#csvTextarea").value = csvString + "\n";
  document.querySelector("#step3 textarea").classList.remove("hidden");
  document.querySelectorAll("#step4 a").forEach(x=>x.classList.remove("hidden"));
  document.querySelectorAll("#step4 a").forEach(x=>x.download = "" + (new Date()).getTime() + ".csv");
}//emitCsv
