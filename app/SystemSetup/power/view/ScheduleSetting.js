/*
Invoked when users want to set power schedule.
 */
Ext.define('DESKTOP.SystemSetup.power.view.ScheduleSetting', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    requires: [
        'DESKTOP.SystemSetup.power.model.ScheduleModel'
    ],
    title: 'Create New Schedule',
    controller: 'schedule',
    closeAction: 'destroy',
    modal: true,
    bodyPadding: 20,
    width: 600,
    resizable: false,
    config: {
        index: 100
    },
    items: [{
        xtype: 'form',
        msgTarget: 'qtip',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                    xtype: 'container',
                    qDefault: true,
                    customLayout: 'hlayout',
                    items: [{
                        xtype: 'combobox',
                        name: 'schedule_action',
                        qDefault: true,
                        editable: false,
                        labelFontWeight: 'bold',
                        labelFontColor: 'title',
                        fieldLabel: 'Choose Type',
                        valueField: 'value',
                        displayField: 'str',
                        queryMode: 'local',
                        itemId: 'scheAction',
                        value: 0,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value'],
                            data: [{
                                "value": 0,
                                "str": "Shutdown"
                            }, {
                                "value": 1,
                                "str": "Turn on"
                            }, {
                                "value": 2,
                                "str": "Reboot"
                            }]
                        })
                    }]
                }, {
                    xtype: 'container',
                    qDefault: true,
                    customLayout: 'hlayout',
                    items: [{
                        xtype: 'combobox',
                        name: 'schedule_type',
                        qDefault: true,
                        editable: false,
                        // width: 110,
                        itemId: 'combo',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value'],
                            data: [{
                                "value": "daily",
                                "str": "Daily"
                            }, {
                                "value": "weekly",
                                "str": "Weekly"
                            }, {
                                "value": "specific date",
                                "str": "Specific day"
                            }]
                        }),
                        valueField: 'value',
                        displayField: 'str',
                        queryMode: 'local',
                        value: 'daily',
                        listeners: {
                            select: function (combobox) {
                                var scheduletype = combobox.getValue();
                                switch (scheduletype) {
                                case 'daily':
                                    combobox.up('form').down('#Daily').show();
                                    combobox.up('form').down('#Weekly').hide();
                                    combobox.up('form').down('#Specific').hide();
                                    break;
                                case 'weekly':
                                    combobox.up('form').down('#Weekly').show();
                                    combobox.up('form').down('#Daily').hide();
                                    combobox.up('form').down('#Specific').hide();
                                    break;
                                case 'specific date':
                                    combobox.up('form').down('#Specific').show();
                                    combobox.up('form').down('#Daily').hide();
                                    combobox.up('form').down('#Weekly').hide();
                                    break;
                                }
                            }
                        }
                    }]
                }, {
                    /* Use common timefield no matter users choose which type */
                    xtype: 'container',
                    qDefault: true,
                    itemId: 'timeset',
                    customLayout: 'hlayout',
                    width: '100%',
                    // defaults: {
                    //     allowBlank: false
                    // },
                    items: [{
                        xtype: 'label',
                        qDefault: true,
                        text: 'Start at'
                    }, {
                        name: 'hours',
                        xtype: 'numberfield',
                        qDefault: true,
                        // width:100,
                        emptyText: 'Hour',
                        // fieldLabel: 'Start at',
                        maxValue: 23,
                        minValue: 0,
                        value: 12,
                        itemId: 'Hour'
                    }, {
                        name: 'minutes',
                        xtype: 'numberfield',
                        qDefault: true,
                        emptyText: 'min',
                        // width:100,
                        fieldLabel: ':',
                        // padding: '0 0 0 10',
                        maxValue: 59,
                        minValue: 0,
                        value: 0,
                        itemId: 'Min'
                    }]
                },
                /* Daily field */
                {
                    xtype: 'container',
                    qDefault: true,
                    itemId: 'Daily',
                    customLayout: 'hlayout',
                    items: [{
                        xtype: 'label',
                        qDefault: true,
                        text: 'Every'
                    }, {
                        // padding: '10 0 0 0',
                        xtype: 'numberfield',
                        qDefault: true,
                        // labelWidth: 30,
                        name: 'day_period',
                        // width: 100,
                        maxValue: 28,
                        minValue: 1,
                        value: 1,
                        allowBlank: false,
                        itemId: 'dayP'
                    }, {
                        // padding: '10 0 0 2',
                        xtype: 'label',
                        qDefault: true,
                        text: 'day(s)'
                    }]
                },
                /* Weekly field */
                {
                    xtype: 'container',
                    qDefault: true,
                    customLayout: 'vlayout',
                    hidden: true,
                    itemId: 'Weekly',
                    items: [{
                        xtype: 'container',
                        qDefault: true,
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'label',
                            text: 'Every'
                        }, {
                            xtype: 'numberfield',
                            qDefault: true,
                            name: 'week_period',
                            maxValue: 4,
                            minValue: 1,
                            value: 1,
                            allowBlank: false,
                            itemId: 'weekP'
                        }, {
                            // padding: '10 0 0 2',
                            xtype: 'label',
                            qDefault: true,
                            text: 'week(s)'
                        }]
                    }, {
                        xtype: 'container',
                        qDefault: true,
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'checkboxgroup',
                            qDefault: true,
                            itemId: 'weekDays',
                            maskOnDisable: true,
                            columns: 3,
                            vertical: true,
                            items: [{
                                boxLabel: 'Monday',
                                name: 'weekdays[]',
                                inputValue: '1'
                            }, {
                                boxLabel: 'Tuesday',
                                name: 'weekdays[]',
                                inputValue: '2'
                            }, {
                                boxLabel: 'Wednesday',
                                name: 'weekdays[]',
                                inputValue: '3'
                            }, {
                                boxLabel: 'Thursday',
                                name: 'weekdays[]',
                                inputValue: '4'
                            }, {
                                boxLabel: 'Friday',
                                name: 'weekdays[]',
                                inputValue: '5'
                            }, {
                                boxLabel: 'Saturday',
                                name: 'weekdays[]',
                                inputValue: '6'
                            }, {
                                boxLabel: 'Sunday',
                                name: 'weekdays[]',
                                inputValue: '0'
                            }]
                        }]
                    }]
                },
                /* Specific field */
                {
                    xtype: 'container',
                    qDefault: true,
                    layout: 'hbox',
                    itemId: 'Specific',
                    hidden: true,
                    items: [{
                        // padding: '0 0 0 5',
                        xtype: 'datefield',
                        qDefault: true,
                        itemId: 'specificDate',
                        fieldLabel: 'Date:',
                        anchor: '100%',
                        name: 'to_date',
                        format: 'm-d',
                        minValue: new Date(),
                        maxValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 1),
                        value: new Date() // defaults to today
                    }]
                }
            ]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        qDefault: true,
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        buttonType: 'primary',
        qDefault: true,
        listeners: {
            click: 'onSettingApply'
        }
    }]
});
