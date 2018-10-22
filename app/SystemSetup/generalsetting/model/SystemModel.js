Ext.define('DESKTOP.SystemSetup.generalsetting.model.SystemModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.system',
    data: {
        ident: null,
        ident_label: null
    },
    stores: {
        system: {
            fields: ['system_name', 'buzzer_status', 'ident_led_flag'],
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/generalsetting/System.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var appwindow = Ext.ComponentQuery.query('#appwindow')[0].getController();
                        appwindow.showLoadingMask();
                        if (success) {
                            appwindow.hideLoadingMask();
                            var record = records[0],
                                form = Ext.ComponentQuery.query('#System')[0];
                            form.getForm().loadRecord(record);
                        } else {
                            appwindow.hideLoadingMask();
                            Ext.Msg.alert('Session expired', 'Login session expired, please login again.');
                        }
                    }
                }
            }
        },
        system_ident: {
            /* for updating System identifiction status */
            storeId: 'system_ident',
            fields: ['ident'],
            autoLoad: true,
            needOnLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/generalsetting/System.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        if (success) {
                            var record = records[0],
                                form = Ext.ComponentQuery.query('#System')[0],
                                ident = record.data.ident,
                                qLanguageLabel = {},
                                qLanguageButton = {};
                            if (ident === 'Off') {
                                qLanguageLabel = {
                                    "text": {
                                        "str": "Flash the status light on the front display.",
                                        "key": "IDENT_ON_DESC"
                                    }
                                };
                                qLanguageButton = {
                                    "text": {
                                        "str": "Start",
                                        "key": "START"
                                    }
                                };
                            } else {
                                qLanguageLabel = {
                                    "text": {
                                        "str": "Stop flashing the status light on the front display.",
                                        "key": "IDENT_OFF_DESC"
                                    }
                                };
                                qLanguageButton = {
                                    "text": {
                                        "str": "Stop",
                                        "key": "STOP"
                                    }
                                };
                            }
                            form.getViewModel().set('ident_label', qLanguageLabel);
                            form.getViewModel().set('ident', qLanguageButton);
                            if (typeof (store.timeoutId) !== 'undefined') {
                                clearInterval(store.timeoutId);
                            }
                            store.timeoutId = setInterval(function () {
                                store.reload();
                            }, 5000);
                        } else {
                            Ext.Msg.alert('Session expired', 'Login session expired, please login again.');
                        }
                    }
                }
            }
        }
    }
});
