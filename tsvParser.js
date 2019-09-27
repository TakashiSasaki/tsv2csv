var P = Parsimmon;
var DQ = P.string("\"");
var DQDQ = P.string("\"\"");
var TAB = P.string("\t");
var NL = P.newline;
var END = P.end;

function TsvParser(embracedFieldType, bEmbracedFieldFirst, nFields){
  
  if(embracedFieldType === undefined) {
    embracedFieldType = TsvParser.EMBRACED_FIELD_TYPE_NONE;
  }
  if(bEmbracedFieldFirst === undefined) {
    bEmbracedFieldFirst = false;
  }  

  switch(embracedFieldType) {
    case TsvParser.EMBRACED_FIELD_TYPE_NONE:
      this.embracedField = null;
      //console.log("embracedFieldType === TsvParser.EMBRACED_FIELD_TYPE_NONE");
      break;
    case TsvParser.EMBRACED_FIELD_TYPE_NL:
      this.embracedField = TsvParser.nlField;
      //console.log("embracedFieldType === TsvParser.EMBRACED_FIELD_TYPE_NL");
      break;
    case TsvParser.EMBRACED_FIELD_TYPE_TAB:
      this.embracedField = TsvParser.tabField;
      //console.log("embracedFieldType === TsvParser.EMBRACED_FIELD_TYPE_TAB");
      break;
    case TsvParser.EMBRACED_FIELD_TYPE_NLTAB:
      this.embracedField = TsvParser.nlTabField;
      //console.log("embracedFieldType === TsvParser.EMBRACED_FIELD_TYPE_NLTAB");
      break;
    default:
      throw "Unknown embraced field type, expecting EMBRACED_FIELD_TYPE_NONE, EMBRACED_FIELD_TYPE_NL, EMBRACED_FIELD_TYPE_TAB or EMBRACED_FIELD_TYPE_NLTAB."
  }//switch  
  
  if(this.embracedField === null){
    this.field = TsvParser.dqField.or(TsvParser.nonDqField).or(TsvParser.emptyField)
                  .lookahead(TAB.or(NL));
  } else {
    if(bEmbracedFieldFirst) {
      this.field = this.embracedField.or(TsvParser.dqField).or(TsvParser.nonDqField).or(TsvParser.emptyField)
                    .lookahead(TAB.or(NL));
    } else {
      this.field = TsvParser.dqField.or(this.embracedField).or(TsvParser.nonDqField).or(TsvParser.emptyField)
                    .lookahead(TAB.or(NL));
    }//if
  }//if
    
  //TsvParser.field = TsvParser.dqField.or(TsvParser.nlTabField).or(TsvParser.nonDqField).or(TsvParser.emptyField)
  //            .lookahead(TAB.or(NL).or(END));
  
  if(nFields === undefined || nFields === 0) {
    //console.log("many");
    this.tsvRow = P.seqMap(P.seq(this.field, TAB.result("")).tie().many(), this.field.lookahead(NL),
      function (x, y) {
        x.push(y);
        return x;
      });
  } else {
    //console.log("times, " + nFields);
    this.tsvRow = P.seqMap(P.seq(this.field, TAB.result("")).tie().times(nFields - 1), this.field.lookahead(NL),
      function (x, y) {
        x.push(y);
        return x;
      });    
  }//if
  
  this.tsvRows = P.seqMap(this.tsvRow, NL, function (x, y) {
      return x;
    }).many();
  
  this.parse = function(text){
    var result = this.tsvRows.parse(text);
    console.log(result);
    return result;
  }//parse
}//TsvParser

TsvParser.EMBRACED_FIELD_TYPE_NONE = "EMBRACED_FIELD_TYPE_NONE";
TsvParser.EMBRACED_FIELD_TYPE_NL = "EMBRACED_FIELD_TYPE_NL";
TsvParser.EMBRACED_FIELD_TYPE_TAB = "EMBRACED_FIELD_TYPE_TAB";
TsvParser.EMBRACED_FIELD_TYPE_NLTAB = "EMBRACED_FIELD_TYPE_NLTAB";
  
TsvParser.emptyField = P.lookahead(TAB.or(NL));

TsvParser.nonDqField = P.seq(P.noneOf("\"\t\n\r"),
    P.noneOf("\t\n\r").many().tie())
  .tie()
  .lookahead(TAB.or(NL));

TsvParser.dqField = P.seq(DQ,
    P.noneOf("\t\n\r").many().tie())
  .tie()
  .lookahead(TAB.or(NL));

TsvParser.nlTabField = P.seq(DQ.result(""),
    P.noneOf("\"\t\n\r").or(DQDQ).many().tie(),
    NL.or(TAB),
    P.noneOf("\"").or(DQDQ).many().tie(),
    DQ.result(""))
  .tie()
  .lookahead(TAB.or(NL));

TsvParser.nlField = P.seq(DQ.result(""),
    P.noneOf("\"\t\n\r").or(DQDQ).many().tie(),
    NL,
    P.noneOf("\"\t").or(DQDQ).many().tie(),
    DQ.result(""))
  .tie()
  .lookahead(TAB.or(NL));

TsvParser.tabField = P.seq(DQ.result(""),
    P.noneOf("\"\t\n\r").or(DQDQ).many().tie(),
    TAB,
    P.noneOf("\"\n").or(DQDQ).many().tie(),
    DQ.result(""))
  .tie()
  .lookahead(TAB.or(NL));


function testTsvParser() {
	console.log(TsvParser.emptyField.parse(''));
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
	console.log(parseTsvText('1\t2\t3\n4\t5\t6\n7\t8\t9'));
	console.log(parseTsvText('"\t""\t"""\n'));
	console.log(parseTsvText('"A\t""B\t"""C\n'));
	console.log(emptyTsv.parse('"A\t""\tA"'));
	console.log(nonDqTsv.parse('"A\t""\tA"'));
	console.log(dqTsv.parse('"A\t""\tA"'));
	console.log(dqdqTsv.parse('"A\t""\tA"'));
	console.log(tsvField.parse('"A\t""\tA"'));
	console.log(tsvRow.parse('"A\t""\tA"\t"B\t""\tB"'));
	console.log(tsvRow.parse('"\t""\t"""'));
  console.log(tsvRow.parse('"A\t""B\t"""C'));
  console.log(tsvRow.parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));

  console.log(dqNLTABdqTsv.parse('"').status === false);
  console.log(dqTsv.parse('"').status === true);
  console.log(nonDqTsv.parse('"').status === false);
  console.log(emptyTsv.parse('"').status === false);
  console.log(tsvField.parse('"').status === true);
  console.log(tsvRow.parse('"').status === true);

  console.log(P.seq(dqNLTABdqTsv, TAB).parse('"' + '\t').status === false);
  console.log(P.seq(dqTsv, TAB).parse('"' + '\t').status === true);
  console.log(P.seq(nonDqTsv, TAB).parse('"' + '\t').status === false);
  console.log(P.seq(emptyTsv, TAB).parse('"' + '\t').status === false);
  console.log(P.seq(tsvField, TAB).parse('"' + '\t').status === true);
  console.log(P.seq(tsvRow, NL).parse('"' + '\n').status === true);

  console.log(P.seq(dqNLTABdqTsv).parse('"' + '\t').status === false);
  console.log(P.seq(dqTsv).parse('"' + '\t').status === false);
  console.log(P.seq(nonDqTsv).parse('"' + '\t').status === false);
  console.log(P.seq(emptyTsv).parse('"' + '\t').status === false);
  console.log(P.seq(tsvField).parse('"' + '\t').status === false);
  console.log(P.seq(tsvRow).parse('"' + '\n').status === false);

  console.log(dqNLTABdqTsv.parse('"""\n"""').status === true);
  console.log(dqTsv.parse('"""\n"""').status === false);
  console.log(nonDqTsv.parse('"""\n"""').status === false);
  console.log(emptyTsv.parse('"""\n"""').status === false);
  console.log(tsvField.parse('"""\n"""').status === true);
  console.log(tsvRow.parse('"""\n"""').status === true);
  
  console.log(P.seq(dqNLTABdqTsv, TAB).parse('"""\n"""' + '\t').status === true);
  console.log(P.seq(dqTsv, TAB).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(nonDqTsv, TAB).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(emptyTsv, TAB).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(tsvField, TAB).parse('"""\n"""' + '\t').status === true);
  console.log(P.seq(tsvRow, NL).parse('"""\n"""' + '\n').status === true);
  
  console.log(P.seq(dqNLTABdqTsv).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(dqTsv).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(nonDqTsv).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(emptyTsv).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(tsvField).parse('"""\n"""' + '\t').status === false);
  console.log(P.seq(tsvRow).parse('"""\n"""' + '\n').status === false);
  
  console.log(dqNLTABdqTsv.parse('"""\n""\n"""').status === true);
  console.log(dqTsv.parse('"""\n""\n"""').status === false);
  console.log(nonDqTsv.parse('"""\n""\n"""').status === false);
  console.log(emptyTsv.parse('"""\n""\n"""').status === false);
  console.log(tsvField.parse('"""\n""\n"""').status === true);
  console.log(tsvRow.parse('"""\n""\n"""').status === true);
  
  console.log(P.seq(dqNLTABdqTsv, TAB).parse('"""\n""\n"""' + '\t').status === true);
  console.log(P.seq(dqTsv, TAB).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(nonDqTsv, TAB).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(emptyTsv, TAB).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(tsvField, TAB).parse('"""\n""\n"""' + '\t').status === true);
  console.log(P.seq(tsvRow, NL).parse('"""\n""\n"""' + '\n').status === true);

  console.log(P.seq(dqNLTABdqTsv).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(dqTsv).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(nonDqTsv).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(emptyTsv).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(tsvField).parse('"""\n""\n"""' + '\t').status === false);
  console.log(P.seq(tsvRow).parse('"""\n""\n"""' + '\n').status === false);

  console.log(P.seq(dqTsv, TAB, dqNLTABdqTsv, TAB, dqNLTABdqTsv).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(P.seq(dqNLdqTsv.or(dqTsv), TAB, dqNLTABdqTsv, TAB, dqNLTABdqTsv).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(P.seq(dqTsv, TAB, dqNLTABdqTsv, TAB, dqNLTABdqTsv).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(P.seq(dqTsv, TAB, dqNLTABdqTsv, TAB, dqNLTABdqTsv).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(P.seq(dqTsv, TAB, dqNLTABdqTsv, TAB, dqNLTABdqTsv).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(P.seq(dqTsv, TAB, dqNLTABdqTsv, TAB, dqNLTABdqTsv).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(P.seq(dqTsv.or(dqNLTABdqTsv), TAB, dqNLTABdqTsv.or(dqTsv), TAB, dqNLTABdqTsv.or(dqTsv)).parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
  console.log(tsvRow.parse('"' + '\t' + '"""\n"""' + '\t' + '"""\n""\n"""'));
} //testTsvParser

function testAmbiguity(){
  // """"&CHAR(9)&""""&CHAR(9)&"""" also produces testPattern.
  // testPattern can be interpreted as one or three cells.
  // testAmbituity() shows this ambiguity.
  var testPattern = '"""' + '\t' + '""' + '\t' + '"""' + '\n';
  var tsvParser = new TsvParser();
  console.log(P.seq(TsvParser.dqField, TAB, TsvParser.dqField, TAB, TsvParser.dqField, NL).parse(testPattern));
  console.log(P.seq(TsvParser.nlTabField, NL).parse(testPattern));

  var testPattern2 = testPattern + testPattern;
  console.log(P.seq(TsvParser.dqField, TAB, TsvParser.dqField, TAB, TsvParser.dqField, 
                    NL, 
                    TsvParser.dqField, TAB, TsvParser.dqField, TAB, TsvParser.dqField,
                    NL).parse(testPattern2));
  
  console.log(P.seq(TsvParser.nlTabField, NL, TsvParser.nlTabField, NL).parse(testPattern2));

  console.log(P.seq(TsvParser.nlTabField.or(TsvParser.dqField), 
                    NL, 
                    TsvParser.nlTabField.or(TsvParser.dqField),
                    NL).parse(testPattern2));
  
  console.log(P.seq(TsvParser.tabField.or(TsvParser.dqField), 
                    NL, 
                    TsvParser.tabField.or(TsvParser.dqField),
                    NL).parse(testPattern2));
  
  console.log(P.seq(TsvParser.dqField.or(TsvParser.nlTabField), TAB, 
                    TsvParser.dqField.or(TsvParser.nlTabField), TAB, 
                    TsvParser.dqField.or(TsvParser.nlTabField), 
                    NL, 
                    TsvParser.dqField.or(TsvParser.nlTabField), TAB, 
                    TsvParser.dqField.or(TsvParser.nlTabField), TAB, 
                    TsvParser.dqField.or(TsvParser.nlTabField),
                    NL).parse(testPattern2));
  
  console.log((new TsvParser()).parse("AA\n"));
  
  console.log((new TsvParser()).parse(testPattern2)); // matched
  console.log((new TsvParser(undefined, undefined)).parse(testPattern2));
  console.log((new TsvParser(undefined, undefined, 0)).parse(testPattern2));
  console.log((new TsvParser(undefined, undefined, 1)).parse(testPattern2));
  console.log((new TsvParser(undefined, undefined, 2)).parse(testPattern2));
  console.log((new TsvParser(undefined, undefined, 3)).parse(testPattern2)); // matched
  console.log((new TsvParser(undefined, undefined, 4)).parse(testPattern2));
  
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NONE, undefined, 0)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NONE, undefined, 1)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NONE, undefined, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NONE, undefined, 3)).parse(testPattern2)); //matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NONE, undefined, 4)).parse(testPattern2));
  
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, false, 0)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, false, 1)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, false, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, false, 3)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, false, 4)).parse(testPattern2));
  
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, true, 0)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, true, 1)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, true, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, true, 3)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NL, true, 4)).parse(testPattern2));

  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, false, 0)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, false, 1)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, false, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, false, 3)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, false, 4)).parse(testPattern2));
  
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, true, 0)).parse(testPattern2)); //matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, true, 1)).parse(testPattern2)); //matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, true, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, true, 3)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_TAB, true, 4)).parse(testPattern2));
  
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, false, 0)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, false, 1)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, false, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, false, 3)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, false, 4)).parse(testPattern2));
  
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, true, 0)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, true, 1)).parse(testPattern2)); // matched
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, true, 2)).parse(testPattern2));
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, true, 3)).parse(testPattern2)); 
  console.log((new TsvParser(TsvParser.EMBRACED_FIELD_TYPE_NLTAB, true, 4)).parse(testPattern2));
}//testAmbiguity

//setTimeout(testTsvParser, 100);
