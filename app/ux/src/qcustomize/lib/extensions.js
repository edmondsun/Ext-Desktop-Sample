/**
 * Ext.String.qFormat
 * [1] for String: Ext.String.qFormat(str, param1, param2, ...);
 * usage: Ext.String.qFormat("Hello. My name is {0} {1}.", "FirstName", "LastName");
 * output: Hello. My name is FirstName LastName.
 * [2] for Array: Ext.String.qFormat(str, [param1, param2, ...]);
 * usage: Ext.String.qFormat("Hello. My name is {0} {1}.", ["FirstName", "LastName"]);
 * output: Hello. My name is FirstName LastName.
 */
Ext.String.qFormat = function () {
    var theString = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
            var param = arguments[i];
            for (var j = 0; j < param.length; j++) {
                theString = convertString(theString, j, param[j]);
            }
            break;
        } else {
            theString = convertString(theString, i - 1, arguments[i]);
        }
    }
    return theString;

    function convertString(formatString, order, string) {
        var regEx = new RegExp('({)?\\{' + order + '\\}(?!})', 'gm');
        return formatString.replace(regEx, string);
    }
};
