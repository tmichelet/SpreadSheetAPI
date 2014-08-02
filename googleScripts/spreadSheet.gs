/***

-----
Spreadsheet API
---
Macros to interact with users' spreadsheets


API:
- doGet(): dispatcher - call it with the method names and parameters
- getUserName()
- createSpreadSheet(name)
- createSheet(url, name)
- getUserSpreadSheet(key)
- setUserSpreadSheet(key, value)
- getSpreadSheet(url, [sheetId | sheetName])
- getValue(url, sheetParams, key)
- insert(url, sheetParams, key, values, delimiter, [columnId])

Roadmap:
- missing doGet requests and tests
- bad doGet requests
- hide api properties
- setUserSpreadsheet status
- fix inconsistant test
- apps rights
- readme
- real example
- how to execute / contribute
- improve doGet tests
- sort things to be faster

see https://developers.google.com/apps-script/reference

***/

function getUserName() {
  return Session.getUser().getUserLoginId();
}

function createSpreadSheet(name) {
  var spreadsheet = SpreadsheetApp.create(name);
  return spreadsheet.getUrl();
}

function createSheet(url, name) {
  var spreadsheet = SpreadsheetApp.openByUrl(url);
  spreadsheet.insertSheet(name, spreadsheet.getSheets().length);
}

function getUserSpreadSheet(key) {
  return PropertiesService.getUserProperties().getProperty(key);
}

function setUserSpreadSheet(key, value) {
  return PropertiesService.getUserProperties().setProperty(key, value);
}

function getSpreadSheet(url, sheetParams) {
  var sheets = _getSheets(url, sheetParams);
  var response = [];
  for(var i=0; i<sheets.length; i++) {
    var sheet = sheets[i];
    var sheetContent = new Array(0);
    _crawlSheet(sheet, function(row, rowNumber, arg) {arg.push(row);}, sheetContent);
    response.push({
      'name': sheet.getName(),
      'id': i,
      'content': sheetContent
    });
  }
  return response;
}


/*
  method: Do something with row, rowNumber and methodParam
          If returns true, stop iteration
*/
function _crawlSheet(sheet, method, methodParam) {
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var rowValues = rows.getValues();
  for (var rowNumber=0; rowNumber<numRows; rowNumber++) {
    var row = rowValues[rowNumber];
    if(method(row, rowNumber, methodParam)) return row;
  }
  return [];
}

function _getSheets(url, sheetParams) {
  try {
    var sheets = SpreadsheetApp.openByUrl(url).getSheets();
    if(sheetParams === undefined || sheetParams === null) return sheets;
    if(typeof sheetParams === "number" && sheetParams >= 0) return [sheets[Math.floor(sheetParams)]];

    // retrieve first sheet with matching name
    for (var j=0; j<sheets.length; j++) {
      if(sheets[j].getName() === sheetParams) return [sheets[j]];
    }
  } catch(err) {}
  return [];
}

function getValue(url, sheetParams, key) {
  try {
    var sheet = _getSheets(url, sheetParams)[0];
    return _crawlSheet(sheet, function(row, rowNumber, arg) { if(row[0] === key) return true;}, key);
  } catch(err) {}
  return []
}

function insert(url, sheetParams, key, values, delimiter, columnId) {
  try {
    var sheet = _getSheets(url, sheetParams)[0];
    var lineNumber = new Array(0);
    _crawlSheet(sheet, function(row, rowNumber, arg) {
        if(row[0] === arg['key']) {
          arg['lineNumber'].push(rowNumber + 1);
          return true;
        }
      }, {'key': key, 'lineNumber': lineNumber});

    if(lineNumber.length === 0) lineNumber = [sheet.getDataRange().getNumRows() + 1];
    lineNumber = lineNumber[0];

    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // for column names
    if(columnId !== undefined) {
      sheet.getRange(alphabet[columnId] + lineNumber).setValue(values);
    } else {
      values = values.split(delimiter);
      for (var i=0; i<values.length; i++) {
        sheet.getRange(alphabet[i] + lineNumber).setValue(values[i]);
      }
    }
    return true;
  } catch(err) {}
  return false;
}

function _setOutput(e, data) {
  return ContentService.createTextOutput(e.parameter.callback + "(" + JSON.stringify(data) + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doGet(e) {
  // auth handle
  /*if (e.parameter.auth) {
    return HtmlService.createHtmlOutput('Thank you! Now the script can run!');
  }*/
  Logger.log(getUserName() + ' connected');
  var p = e.parameter;

  // hello world
  if(e.parameter.method === 'helloWorld') return _setOutput(e, {hello: 'world'});

  // getUserName()
  if(e.parameter.method === 'getUserName') return _setOutput(e, {user: getUserName()});

  // createSpreadSheet(name)
  if(e.parameter.method === 'createSpreadSheet') return _setOutput(e, {url: createSpreadSheet(p.name)});

  // createSheet(url, name)
  if(e.parameter.method === 'createSheet') return _setOutput(e, {status: createSheet(p.url, p.name)});

  // getUserSpreadSheet(key)
  if(e.parameter.method === 'getUserSpreadSheet') return _setOutput(e, {spreadSheetURL: getUserSpreadSheet(p.key)});

  // setUserSpreadSheet(key, value)
  if(e.parameter.method === 'setUserSpreadSheet') return _setOutput(e, {status: setUserSpreadSheet(p.key, p.value)});

  // getSpreadSheet(url, [sheetId | sheetName])
  if(e.parameter.method === 'getSpreadSheet') return _setOutput(e, {content: getSpreadSheet(p.url, p.sheetParams)});

  // getValue(url, sheetParams, key)
  if(e.parameter.method === 'getValue') return _setOutput(e, {value: getValue(p.url, p.sheetParams, p.key)});

  // insert(url, sheetParams, key, values, delimiter, [columnId])
  if(e.parameter.method === 'insert') return _setOutput(e, {status: insert(p.url, p.sheetParams, p.key, p.values, p.delimiter, p.columnId)});

  return _setOutput(e, {status: "Request not found", availableMethods: ""});
}
