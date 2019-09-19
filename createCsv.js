function createCsv(){
  var x = document.querySelector("#numberColumnsInput").value.split(",");
  var numberColumns = [];
  for(var i in x){
    var y = parseInt(x[i]);
    if(isNaN(y)) continue;
    numberColumns.push(y);
  }//for
  var tsv = document.querySelector("#tsvTextarea").value;
  var tsvRows = tsv.split("\n");
  
  if(typeof tsvRows[tsvRows.length-1] === "string" && tsvRows[tsvRows.length-1].length === 0){
    tsvRows.pop();
  }// remove last last row
  
  document.querySelector("#linesInput").value = tsvRows.length;
  var csvRows = [];
  for(var j=0; j<tsvRows.length; ++j){
    var tsvRow = tsvRows[j];
    if(tsvRow.length===0) continue;
    var tsvColumns = tsvRow.split("\t");
    var csvColumns = [];
    if(j===0 && document.querySelector("#hasHeaderInput").checked){
      for(var k=0; k<tsvColumns.length; ++k){
        csvColumns.push('"'+tsvColumns[k]+'"');
      }//for
      csvRows.push(csvColumns);
      continue;
    }//if
    for(var k=0; k<tsvColumns.length; ++k){
      if(numberColumns.indexOf(k+1) >=0){
        csvColumns.push(tsvColumns[k]);
      } else {
        csvColumns.push('"'+tsvColumns[k]+'"');
      }
    }//for
    csvRows.push(csvColumns);
  }//for
  emitCsv(csvRows);
  document.querySelector("#jsonTextarea").value =  JSON.stringify(csvRows);
}

function emitCsv(csvRows){
  var csvRowStrings = [];
  for(var i=0; i<csvRows.length; ++i){
      var csvRowString = csvRows[i].join(",");
      csvRowStrings.push(csvRowString);
  }//for
  var csvString = csvRowStrings.join("\n");
  document.querySelector("#csvTextarea").value = csvString + "\n";
  document.querySelector("#nCsvRows").value = csvRowStrings.length;
}//emitCsv
