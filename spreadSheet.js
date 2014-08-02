var spreadSheet = {
    _spreadsheet: '',

    _call: function(params) {
        var my_awesome_script = document.createElement('script');
        my_awesome_script.setAttribute('src','https://script.google.com/macros/s/AKfycbxcdb59Q8e-FvAz9IqOPIWa5cHd9gPNvZo1251NNTCtmTcYzORz/exec?' + params);
        document.head.appendChild(my_awesome_script);
    }
};
