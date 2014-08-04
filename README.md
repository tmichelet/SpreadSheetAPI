SpreadSheetAPI
==============

Use a google spreadsheet as your database.

Why?
----
- Google reliability and scalability
- Completely free
- The user knows what data is used and can update it easily.

How to?
---
Javascript:
```
var spreadSheet = new SpreadSheet("Test SpreadSheetAPI");
spreadSheet.getSpreadSheet(function(data) { console.log(data); });
```

CURL:
```
https://script.google.com/macros/s/AKfycbxcdb59Q8e-FvAz9IqOPIWa5cHd9gPNvZo1251NNTCtmTcYzORz/exec?method=METHOD_NAME&foo=bar
```

API
---
- `getUserName()`
- `createSpreadSheet(name)`
- `createSheet(url, name)`
- `getUserSpreadSheet(key)`
- `setUserSpreadSheet(key, value)`
- `getSpreadSheet(url, [sheetId | sheetName])`
- `getValue(id, sheetId, key)`
- `insert(id, sheetId, key, values, delimiter, [columnId])`


More to come soon.
