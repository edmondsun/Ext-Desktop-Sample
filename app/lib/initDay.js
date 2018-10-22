Ext.define('DESKTOP.lib.initDay', {
    config: {
        // get by getData()
        data: []
    },
    judge_dates: function (year, month) {
        var monDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 === 0) && (month == 2))
            return 29;
        // is leapyear
        else
            return monDays[month - 1];
    },
    create_dateStore: function (field, number) {
        // creating a store for dates
        var i;
        var data = [];
        for (i = 1; i <= number; i++) {
            var tmp_obj = {};
            tmp_obj[field] = ('0' + i).slice(-2);
            data.push(tmp_obj);
        }
        var store = Ext.create('Ext.data.Store', {
            fields: field,
            data: data
        });
        return store;
    },
    create_record: function () {
        // creating a array
        this.setData(null);
        var n = arguments.length;
        var j;
        var tmp_data = [];
        var tmp_obj = {};
        if (n > 4 || n < 3) {
            return 0;
        }
        // aggument : field, begin, end
        else if (n == 3) {
            for (j = arguments[1]; j <= arguments[2]; j++) {
                tmp_obj = {};
                tmp_obj[arguments[0]] = ('0' + j).slice(-2);
                tmp_data.push(tmp_obj);
            }
        }
        // aggument : field, begin, end, slice
        else {
            for (j = arguments[1]; j <= arguments[2]; j++) {
                tmp_obj = {};
                tmp_obj[arguments[0]] = ('0' + j).slice(0 - arguments[3]);
                tmp_data.push(tmp_obj);
            }
        }
        this.setData(tmp_data);
    }
});
