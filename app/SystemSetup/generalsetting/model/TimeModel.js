Ext.define('DESKTOP.SystemSetup.generalsetting.model.TimeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.time',
    requires: ['DESKTOP.lib.initDay'],
    stores: {
        ntp: {
            fields: ['ntpList'],
            storeId: 'ntpList',
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/generalsetting/Time.php',
                method: 'get',
                reader: {
                    type: 'array',
                    rootProperty: 'ntpServer',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        if (!success) {
                            Ext.Msg.alert('Session expired', 'Login session expired, please login again.');
                        }
                    }
                }
            }
        },
        timeZone: {
            storeId: 'timeZone',
            fields: ['tzList', 'tzConf'],
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/generalsetting/Time.php',
                method: 'get',
                reader: {
                    type: 'array',
                    rootProperty: 'timeZone',
                    successProperty: 'success'
                }
            }
        },
        sysTime: {
            storeId: 'sysTime',
            fields: [
                'hour', 'min', 'sec',
                'year', 'mon', 'day', 'ampm',
                'ntp_checked', 'time_zone', 'ntp_server'
            ],
            autoLoad: false,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/generalsetting/Time.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'sysTime',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        if (success) {
                            var form = Ext.ComponentQuery.query('#TimeDate')[0],
                                record = records[0],
                                data = record.data;
                            data.day = ('0' + data.day).slice(-2);
                            data.hour = ('0' + data.hour).slice(-2);
                            data.min = ('0' + data.min).slice(-2);
                            data.month = ('0' + data.month).slice(-2);
                            data.sec = ('0' + data.sec).slice(-2);
                            form.getForm().loadRecord(record);

                        } else {
                            Ext.Msg.alert('Session expired', 'Login session expired, please login again.');
                        }
                    }
                }
            }
        },
        minstore: {
            fields: ['minvalue'],
            autoLoad: true,
            needOnLoad: true,
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('minvalue', 0, 59);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        secstore: {
            fields: ['secvalue'],
            autoLoad: true,
            needOnLoad: true,
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('secvalue', 0, 59);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        hrstore: {
            fields: ['hourvalue'],
            autoLoad: true,
            needOnLoad: true,
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('hourvalue', 0, 11);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        yearstore: {
            fields: ['yearValue'],
            autoLoad: true,
            needOnLoad: true,
            listeners: {
                load: function (store) {
                    var year = new Date().getFullYear(),
                        tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('yearValue', year - 10, year + 10, 4);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        monthstore: {
            fields: ['monthvalue'],
            autoLoad: true,
            needOnLoad: true,
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay();
                    tmp_data.create_record('monthvalue', 1, 12);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                }
            }
        },
        daystore: {
            fields: ['dayvalue'],
            autoLoad: true,
            needOnLoad: true,
            listeners: {
                load: function (store) {
                    var tmp_data = new DESKTOP.lib.initDay(),
                        time_store = Ext.StoreManager.lookup('sysTime');
                    tmp_data.create_record('dayvalue', 1, 31);
                    var tmp_record = tmp_data.getData();
                    store.loadData(tmp_record);
                    time_store.load();
                }
            }
        }
    }
});
