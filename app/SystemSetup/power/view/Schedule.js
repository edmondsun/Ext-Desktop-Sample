Ext.define('DESKTOP.SystemSetup.power.view.Schedule.js', {
    extend: 'Ext.form.Panel',
    alias: 'widget.schedule',
    requires: [
        'DESKTOP.SystemSetup.power.controller.ScheduleController',
        'DESKTOP.SystemSetup.power.model.ScheduleModel'
    ],
    controller: 'schedule',
    viewModel: {
        type: 'schedule'
    },
    itemId: 'Schedule',
    title: 'Schedule',
    frame: true,
    collapsible: true,
    autoScroll: false,
    waitMsgTarget: true,
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
                name: 'power_schedule_enable',
                reference: 'enableBox',
                inputValue: 1,
                uncheckedValue: 0,
                boxLabel: 'Enable Power schedule',
                labelFontWeight: 'bold',
                labelFontColor: 'title'
            }]
        }, {
            // grid buttons
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'toolbar',
                itemId: 'pwrscheduletoolbar',
                qDefault: true,
                dock: 'top',
                width: '100%',
                defaults: {
                    maskOnDisable: true, // avoid buttons being focused after pressed
                    focusable: false,
                    xtype: 'button'
                },
                items: ['->', {
                    text: 'Add power schedule',
                    listeners: {
                        click: 'onAdd'
                    }
                }, {
                    text: 'Edit',
                    listeners: {
                        click: 'onEdit'
                    }
                }, {
                    text: 'Delete',
                    listeners: {
                        click: 'onDelete'
                    }
                }]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                // exhibit existing schedules
                xtype: 'gridpanel',
                qDefault: true,
                width: '100%',
                bind: '{schedulearr}',
                reference: 'pwrschedule',
                itemId: 'pwrschedule',
                //disabled: '{!power_schedule_enable}',
                forceFit: true,
                columns: [{
                    text: 'Task',
                    dataIndex: 'action',
                    sortable: false,
                    menuDisabled: true,
                    renderer: function (value) {
                        switch (value) {
                            case 0:  return 'Shutdown';
                            case 1:  return 'Turn on';
                            case 2:  return 'Reboot';
                        }
                    }
                }, {
                    text: 'Schedule',
                    dataIndex: 'type',
                    sortable: false,
                    menuDisabled: true
                }, {
                    text: 'Time',
                    dataIndex: 'hours',
                    menuDisabled: true,
                    renderer: function (value, metaData, record, store) {
                        var minutes = record.get('minutes');
                        if (value)
                            return value + ':' + minutes;
                    }
                }, {
                    text: 'Description',
                    dataIndex: 'type',
                    menuDisabled: true,
                    renderer: function (value, metaData, record, store) {
                        var day_period = record.get('day_period'),
                            week_period = record.get('week_period'),
                            weekdays = record.get('weekdays'),
                            weekarr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                            weekdaysarr = [],
                            months = record.get('months'),
                            dates = record.get('dates');
                        if (value == 'daily') {
                            return 'Every ' + day_period + ' day(s)';
                        } else if (value == 'weekly') {
                            for (var i = 0; i < weekdays.length; i++) {
                                weekdaysarr[i] = weekarr[weekdays[i]];
                            }
                            return 'Every ' + week_period + ' week(s)   ' + weekdaysarr;
                        } else {
                            return months + '/' + dates;
                        }
                    }
                }]
            }]
        }]
    }]
});
