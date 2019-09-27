var parserResult;

function onParseButtonClick() {
  document.querySelector("#step2 button").disabled = true;
  document.querySelector("#step2 table").classList.add("hidden");
  document.querySelector("#tableChartDiv").innerText = "分析中";
  var embracedFieldType = document.querySelector("#step2 input[name='embracedFieldType']:checked").value;
  var bEmbracedFieldFirst = document.querySelector("#step2 input[name='embracedFieldFirst']:checked").value === "EMBRACED_FIELD_FIRST_YES" ? true : false;
	var tsvText = document.querySelector("#tsvTextarea").value;
  if(tsvText[tsvText.length-1] !== '\n') {
    tsvText += '\n';
  }//if
  console.log(embracedFieldType);
  console.log(bEmbracedFieldFirst);
  var tsvParser = new TsvParser(embracedFieldType,bEmbracedFieldFirst);
  setTimeout(function(){
    parserResult = tsvParser.parse(tsvText);
    setTimeout(function(){
      if (parserResult.status === true) {
        setTimeout(function(){
          showStatistics(parserResult.value);
          drawTableChart(parserResult.value);
          document.querySelector("#step2 button").disabled = false;
          document.querySelector("#step3 button").disabled = false;
        });
      } else {
        document.querySelector("#step2 button").disabled = false;
        document.querySelector("#step3 button").disabled = true;
      } //if
    });
  });
} //parseTsv/parseTsv

function drawTableChart(rows){
  //console.log(rows);
  var nColumns = rows.reduce(function(acc, curr){acc.push(curr.length); return acc;}, []);
  console.log(nColumns);
  var nMaxColumns = Math.max.apply(null, nColumns);
  console.log(nMaxColumns);
  var tableChartDiv = document.querySelector("#tableChartDiv");
  tableChartDiv.innerText = null;
  var dataTable = new google.visualization.DataTable();
  for(var i=1; i<=nMaxColumns; ++i){
    dataTable.addColumn("string", i);    
  }//for
  for(var j=0; j<rows.length; ++j){
    if(j == 10) break;
    dataTable.addRow(rows[j].concat(new Array(nMaxColumns - rows[j].length)));
  }//for
  //dataTable.addRows(rows);
  var tableChart = new google.visualization.Table(tableChartDiv);
  tableChart.draw(dataTable, {showRowNumber: true, cssClassNames : {
                              tableCell: "yellow"
                             }});
}//drawTableChart

function showStatistics(cellRows){
  var statistics = {};
  for(var i=0; i<cellRows.length; ++i){
    var nCellsInRow = cellRows[i].length;
    if(statistics[nCellsInRow] === undefined){
      statistics[nCellsInRow] = 1;
    } else {
      statistics[nCellsInRow] += 1;
    }
  }
  document.querySelector("#step2 table").innerText=null;
  for(var i=0; i<Object.keys(statistics).length; ++i){
    //console.log(statistics[Object.keys(statistics)[i]]);
    var tr = document.createElement("TR");
    var td0 = document.createElement("TD");
    td0.innerText = "セル"
    var td1 = document.createElement("TD");
    td1.innerText = Object.keys(statistics)[i];
    var td2 = document.createElement("TD");
    td2.innerText = "個の行が"
    var td3 = document.createElement("TD");
    td3.innerText = statistics[Object.keys(statistics)[i]];
    var td4 = document.createElement("TD");
    td4.innerText = "行"
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    document.querySelector("#step2 table").appendChild(tr);
  }
  //console.log(statistics);
  document.querySelector("#step2 table").classList.remove("hidden");
}//showStatistics
