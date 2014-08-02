/*
- getUserName()
- createSpreadSheet(name)
- createSheet(url, name)
- getUserSpreadSheet(key)
- setUserSpreadSheet(key, value)
- getSpreadSheet(url, [sheetId | sheetName])
- getValue(id, sheetId, key)
- insert(id, sheetId, key, values, delimiter, [columnId])
*/

function SpreadSheet(key) {
    this._key = key;
    this._spreadsheet = 'https://script.google.com/macros/s/AKfycbxcdb59Q8e-FvAz9IqOPIWa5cHd9gPNvZo1251NNTCtmTcYzORz/exec?';
}

SpreadSheet.prototype.getKey = function () {
    return this._key;
};

SpreadSheet.prototype._helloWorld = function (cb) {
    return this._call('helloWorld', {}, cb);
};

SpreadSheet.prototype.getUserName = function (cb) {
    return this._call('getUserName', {}, cb);
};

SpreadSheet.prototype.getUserSpreadSheet = function (key, cb) {
    return this._call('getUserSpreadSheet', {key: key}, cb);
};

SpreadSheet.prototype.setUserSpreadSheet = function (key, value, cb) {
    return this._call('setUserSpreadSheet', {key: key, value: value}, cb);
};

SpreadSheet.prototype.createSpreadSheet = function (name, cb) {
    return this._call('createSpreadSheet', {name: name}, cb);
};

SpreadSheet.prototype.createSheet = function (url, name, cb) {
    return this._call('createSheet', {url: url, name: name}, cb);
};

SpreadSheet.prototype.getSpreadSheet = function (url, sheetParams, cb) {
    return this._call('getSpreadSheet', {url: url, sheetParams: sheetParams}, cb);
};

SpreadSheet.prototype.getValue = function (url, sheetParams, key, cb) {
    return this._call('getValue', {url: url, sheetParams: sheetParams, key: key}, cb);
};

SpreadSheet.prototype.insert = function (url, sheetParams, key, values, delimiter, columnId, cb) {
    return this._call('getValue', {
        url: url, sheetParams: sheetParams, key: key,
        values: values, delimiter: delimiter, columnId: columnId
    }, cb);
};

SpreadSheet.prototype._call = function(method, parameters, cb) {
    var callbackName = '_spreadsheet_callback_' + Math.floor(Math.random() * 10000);
    window[callbackName] = function(data) { window[callbackName] = undefined; return cb(data); };

    var params = '&method=' + method;
    var keys = Object.keys(parameters);
    for (var i=0;i<keys.length;i++) {
        params += '&' + keys[i] + '=' + parameters[keys[i]];
    }

    var newScript = document.createElement('script');
    newScript.setAttribute('src', this._spreadsheet + 'callback=window.' + callbackName + params);
    document.head.appendChild(newScript);
};

SpreadSheet.prototype._call_v0 = function(params) {
    var my_awesome_script = document.createElement('script');
    my_awesome_script.setAttribute('src', this._spreadsheet + params);
    document.head.appendChild(my_awesome_script);
};
