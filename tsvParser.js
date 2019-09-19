var P = Parsimmon;

var DQ = P.string("\"");
var TAB = P.string("\t");
var NL = P.newline;
var END = P.end;
var NODQ = P.noneOf("\"");

var emptyTsv = P.lookahead(TAB.or(NL).or(END));

var nonDqTsv = P.seq(P.noneOf("\"\t\n\r"), P.noneOf("\t\n\r").many().tie()).tie()
              .lookahead(TAB.or(NL).or(END));

var dqTsv = P.seq(DQ, 
                  P.noneOf("\"").or(DQ.notFollowedBy(TAB.or(NL).or(END))).many().tie(),
                  DQ.lookahead(TAB.or(NL).or(END))).tie();

var tsvField = emptyTsv.or(nonDqTsv).or(dqTsv);

var tsvRow = P.seqMap(P.seq(tsvField, TAB.result("")).tie().many(), tsvField.lookahead(NL.or(END)),
                     function(x,y){x.push(y); return x;});

var tsvRows = P.seqMap(P.seqMap(tsvRow, NL, function(x,y){return x;}).many(), tsvRow,
                          function(x,y){x.push(y); return x;});

function testTsvParser(){
  console.log(emptyTsv.parse(''));
  console.log(nonDqTsv.parse("XYZ"));
  console.log(nonDqTsv.parse('X"Y"Z'));  
  console.log(dqTsv.parse('"ABC"'));
  console.log(dqTsv.parse('"A\tB\tC"'));
  console.log(tsvRow.parse('AA\tBB\tCC\t\t'));
  console.log(tsvRow.parse('\t'));
  console.log(tsvRow.parse('a"b"c\tx'));
  console.log(tsvRow.parse('"A\tB"\ty'));
  console.log(tsvRows.parse('a"b"c\tx\n"A\tB"\ty'));
  console.log(tsvRows.parse('1\t2\t3\n4\t5\t6\n7\t8\t9'));
  console.log(tsvRows.parse('\n'));
  console.log(tsvParser('1\t2\t3\n4\t5\t6\n7\t8\t9'))
}//testTsvParser

setTimeout(testTsvParser, 100);

function tsvParser(tsvDocument){
  var result = tsvRows.parse(tsvDocument);
  if(result.status === true) return result.value;
}//tsvParser
