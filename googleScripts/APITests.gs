/*
  Google script tests
  To run, execute test_all from the script.google.com page, and check console (command + enter)
*/

function test_all() {
  Logger.log('Starting all the tests');
  var testUrl = _cleanTestSpreadSheet();

  _test('getSpreadSheet', test_getSpreadSheet(testUrl));
  _test('getValue', test_getValue(testUrl));
  _test('insert', test_insert(testUrl));

  Logger.log('All tests are done');
}

function test_insert(url) {
  assertions = [
    _compare(getValue(url, 0, 1), [1.0, '', '']),
    insert(url, 0, 1, '1.a.c.', '.'),
    _compare(getValue(url, 0, 1), [1.0, 'a', 'c']),
    insert(url, 0, 1, '1...', '.'),
  ];

  assertions = assertions.concat([
    insert(url, 0, 8, '8/a/c/d', '/'),
    _compare(getValue(url, 0, 8), [8.0, 'a', 'c', 'd']),
    insert(url, 0, 8, '....', '.'),
  ]);

  assertions = assertions.concat([
    !insert('example.com', 0, 1, '', '.'),
  ]);

  assertions = assertions.concat([
    insert(url, 0, 2, 'foobar', '', 2),
    _compare(getValue(url, 0, 2), [2.0, 3.0, 'foobar']),
    insert(url, 0, 2, '', '', 2),
  ]);
  return assertions;
}


function test_getValue(url) {
  return [
    _compare(getValue(url, 0, 1), [1.0, '', '']),
    _compare(getValue(url, 1, 'c'), ['c', 'd']),
    _compare(getValue(url, 0, ''), ['', 4.0, 5.0]),
    _compare(getValue('example.com', 0, ''), []),
  ];
}

function test_getSpreadSheet(url) {
  var sheets;
  sheets = getSpreadSheet(url);
  var assertions = [
    sheets.length === 2,
    sheets[0].name === 'first',
    sheets[1].name === 'second',
    _compare(sheets[0].content, [[1.0, '', ''], [2.0, 3.0, ''], ['', 4.0, 5.0]]),
    _compare(sheets[1].content, [['a', 'b'], ['c', 'd']]),
  ];

  sheets = getSpreadSheet(url, 1);
  assertions = assertions.concat([
    sheets.length === 1,
    _compare(sheets[0].content, [['a', 'b'], ['c', 'd']]),
  ]);

  sheets = getSpreadSheet(url, 'second');
  assertions = assertions.concat([
    sheets.length === 1,
    _compare(sheets[0].content, [['a', 'b'], ['c', 'd']]),
  ]);

  assertions = assertions.concat([
    getSpreadSheet(url, 'third').length === 0
  ]);
  assertions = assertions.concat([
    getSpreadSheet(url, -1).length === 0
  ]);
  assertions = assertions.concat([
    getSpreadSheet(url, 0.5).length === 1
  ]);
  assertions = assertions.concat([
    getSpreadSheet('example.com').length === 0
  ]);

 return assertions;
}

function _cleanTestSpreadSheet() {
  var testSpreadSheetName = "Test SpreadSheetAPI";
  var testSpreadSheetURL = getUserSpreadSheet(testSpreadSheetName);
  try {  // check if it has been deleted
    SpreadsheetApp.openByUrl(testSpreadSheetURL);
  } catch(err) {
    testSpreadSheetURL = null;
  }
  if(testSpreadSheetURL === undefined || testSpreadSheetURL === null) {
    Logger.log('Creating a testsheet');
    testSpreadSheetURL = createSpreadSheet(testSpreadSheetName);
    setUserSpreadSheet(testSpreadSheetName, testSpreadSheetURL);
    SpreadsheetApp.openByUrl(testSpreadSheetURL).getSheets()[0].setName('first');
    createSheet(testSpreadSheetURL, 'second');

    Logger.log('Inserting test values');
    insert(testSpreadSheetURL, 0, '', '1', '.');
    insert(testSpreadSheetURL, 0, '', '2.3', '.');
    insert(testSpreadSheetURL, 0, '', '.4.5', '.');
    insert(testSpreadSheetURL, 1, '', 'a.b', '.');
    insert(testSpreadSheetURL, 1, '', 'c.d', '.');
  }
  return testSpreadSheetURL;
}

function _test(name, assertions) {
  var allGreen = true;
  for(i=0; i<assertions.length; i++) {
    allGreen = allGreen && assertions[i]
  }
  if(!allGreen) {
    Logger.log(name + ' IS RED');
    for(i=0; i<assertions.length; i++) Logger.log(assertions[i]);
  }
  else {
    Logger.log(name + ' is green');
  }
}

function _compare(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
