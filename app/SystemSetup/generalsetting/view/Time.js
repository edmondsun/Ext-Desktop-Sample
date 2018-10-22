Ext.define('DESKTOP.SystemSetup.generalsetting.view.Time', {
    extend: 'Ext.form.Panel',
    alias: 'widget.time',
    requires: [
        'DESKTOP.SystemSetup.generalsetting.controller.TimeController',
        'DESKTOP.SystemSetup.generalsetting.model.TimeModel',
        'DESKTOP.lib.initDay',
        'DESKTOP.lib.isIpIn'
    ],
    controller: 'time',
    viewModel: {
        type: 'time'
    },
    itemId: 'TimeDate',
    title: 'Time',
    frame: true,
    timeout: 50,
    width: 750,
    //bodyPadding: 20,
    url: 'app/SystemSetup/backend/generalsetting/Time.php',
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    fieldDefaults: {
        msgTarget: 'qtip'
    },
    trackResetOnLoad: true,
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'checkboxfield',
                qDefault: true,
                qLanguage: {
                    "boxLabel": {
                        "str": "Get from internet time server",
                        "key": "GET_FROM_INTERNET_TIME_SERVER"
                    }
                },
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                boxLabel: 'Get from internet time server',
                itemId: 'ntp_checked',
                name: 'ntp_checked',
                inputValue: 'on',
                uncheckedValue: 'off',
                listeners: {
                    change: function (checkbox, isChecked) {
                        // Bad implementation
                        var ntp = checkbox.up('container').down('#ntp_server'),
                            ct1 = checkbox.up('container').next('#userSetting');
                        if (isChecked) {
                            ct1.disable();
                            ntp.enable();
                        } else {
                            ct1.enable();
                            ntp.disable();
                        }
                    }
                }
            }, {
                xtype: 'combobox',
                qDefault: true,
                itemId: 'ntp_server',
                name: 'ntp_server',
                qLanguage: {
                    "emptyText": {
                        "str": "Please input a NTP server",
                        "key": "INPUT_NTP_SERVER"
                    },
                    "regexText": {
                        "str": "This field should be DOMAIN NAME or IP ADDRESS.",
                        "key": "SHOULD_BE_DOMAIN_NAME_OR_IP_ADDRESS"
                    }
                },
                bind: {
                    store: '{ntp}'
                },
                queryMode: 'remote',
                valueField: 'ntpList',
                displayField: 'ntpList',
                fields: ["ntpList"],
                typeAhead: false,
                typeAheadDelay: 2000,
                emptyText: 'Please input a NTP server',
                disabled: true,
                allowBlank: false,
                validateOnChange: false,
                regexText: 'This field should be DOMAIN NAME or IP ADDRESS.',
                validator: function (val) {
                    if (val.length > 0) {
                        var check = new DESKTOP.lib.isIpIn();
                        if (check.verify_ip(this.getValue()) || check.verify_domain(this.getValue())) {
                            return true;
                        } else {
                            return this.regexText;
                        }
                    }
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            itemId: 'userSetting',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    qLanguage: {
                        "text": {
                            "str": "Time & Date",
                            "key": "TIME_N_DATE"
                        }
                    },
                    labelFontWeight: 'bold',
                    labelFontColor: 'title',
                    text: 'Date & time'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                itemId: 'time_area',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    qLanguage: {
                        "text": {
                            "str": "Time",
                            "key": "TIME"
                        }
                    },
                    text: 'Time'
                }, {
                    xtype: 'combobox',
                    qDefault: true,
                    name: 'hour',
                    itemId: 'hour',
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    allowBlank: false,
                    bind: {
                        store: '{hrstore}'
                    },
                    queryMode: 'local',
                    fields: ['hourvalue'],
                    displayField: 'hourvalue',
                    valueField: 'hourvalue'
                }, {
                    xtype: 'label',
                    qDefault: true,
                    text: ':'
                }, {
                    name: 'min',
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    allowBlank: false,
                    bind: {
                        store: '{minstore}'
                    },
                    queryMode: 'local',
                    fields: ['minvalue'],
                    displayField: 'minvalue',
                    valueField: 'minvalue'
                }, {
                    xtype: 'label',
                    qDefault: true,
                    text: ':'
                }, {
                    name: 'sec',
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    allowBlank: false,
                    bind: {
                        store: '{secstore}'
                    },
                    queryMode: 'local',
                    fields: ['secvalue'],
                    displayField: 'secvalue',
                    valueField: 'secvalue'
                }, {
                    name: 'ampm',
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['clocktype'],
                        data: [{
                            "clocktype": "AM"
                        }, {
                            "clocktype": "PM"
                        }]
                    }),
                    queryMode: 'local',
                    valueField: 'clocktype',
                    displayField: 'clocktype',
                    fields: ["clocktype"],
                    value: "AM"
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    qLanguage: {
                        "text": {
                            "str": "Date",
                            "key": "DATE"
                        }
                    },
                    text: 'Date'
                }, {
                    name: 'year',
                    xtype: 'combobox',
                    qDefault: true,
                    itemId: 'year',
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    allowBlank: false,
                    bind: {
                        store: '{yearstore}'
                    },
                    queryMode: 'local',
                    fields: ['yearValue'],
                    displayField: 'yearValue',
                    valueField: 'yearValue',
                    listeners: {
                        change: function (combobox, newvalue) {
                            var check = new DESKTOP.lib.initDay(),
                                month = combobox.up('form').down('#month').getValue(),
                                day = combobox.up('form').down('#day'),
                                daynum = check.judge_dates(newvalue, month),
                                store = check.create_dateStore('dayvalue', daynum);
                            day.bindStore(store);
                        }
                    }
                }, {
                    xtype: 'label',
                    qDefault: true,
                    text: '/'
                }, {
                    name: 'month',
                    itemId: 'month',
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    allowBlank: false,
                    bind: {
                        store: '{monthstore}'
                    },
                    queryMode: 'local',
                    fields: ['monthvalue'],
                    valueField: 'monthvalue',
                    displayField: 'monthvalue',
                    listeners: {
                        change: function (combobox, newvalue) {
                            var check = new DESKTOP.lib.initDay(),
                                year = combobox.up('form').down('#year').getValue(),
                                day = combobox.up('form').down('#day'),
                                daynum = check.judge_dates(year, newvalue),
                                store = check.create_dateStore('dayvalue', daynum);
                            day.bindStore(store);
                            if (day.getValue() > store.getCount()) {
                                day.select(store.getCount());
                            }
                        }
                    }
                }, {
                    xtype: 'label',
                    qDefault: true,
                    text: '/'
                }, {
                    name: 'day',
                    xtype: 'combobox',
                    qDefault: true,
                    bind: {
                        store: '{daystore}'
                    },
                    queryMode: 'local',
                    fields: ['dayvalue'],
                    itemId: 'day',
                    editable: false,
                    width: 70,
                    matchFieldWidth: false,
                    valueField: 'dayvalue',
                    displayField: 'dayvalue',
                    allowBlank: false
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                qLanguage: {
                    "text": {
                        "str": "Time Zone",
                        "key": "TIME_ZONE"
                    }
                },
                text: 'Time Zone'
            }, {
                name: 'time_zone',
                xtype: 'combobox',
                qDefault: true,
                editable: false,
                width: 420,
                bind: {
                    store: '{timeZone}'
                },
                queryMode: 'local',
                fields: ['tzList', 'tzConf'],
                valueField: 'tzConf',
                displayField: 'tzList',
                allowBlank: false
            }]
        }]
    }]
});
