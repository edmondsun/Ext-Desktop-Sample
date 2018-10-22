Ext.define('DESKTOP.StorageManagement.snapshot.view.ManagementSetting', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    alias: 'widget.window_snapshotsetting',
    requires: [
        'DESKTOP.StorageManagement.snapshot.controller.ManagementSettingController',
        'DESKTOP.StorageManagement.snapshot.model.ManagementModel'
    ],
    controller: 'snapshotmanagementset',
    viewModel: {
        type: 'snapshotmanagement'
    },
    resizable: false,
    closeAction: 'destroy',
    width: 600,
    modal: true,
    bodyPadding: 20,
    waitMsgTarget: true,
    config: {
        /**
         * windowLayout: 'small/medium'
         * default: 'small'
         */
        windowSize: '',
        /**
         * actionType: 'TakeSnapshot/SnapshotClone/RollBack/DeleteSnapshot/SnapshotSchedule'
         * default: ''
         */
        actionType: ''
    },
    applyWindowSize: function (value) {
        if (value.length === 0) {
            return;
        }
        switch (value) {
        case 'small':
            Ext.apply(this, {
                height: 200
            });
            break;
        case 'medium':
            Ext.apply(this, {
                height: 400
            });
            break;
        default:
            break;
        }
        console.log('applyWindowSize', value);
    },
    applyActionType: function (value) {
        if (value.length === 0) {
            return;
        }
        switch (value) {
        case 'TakeSnapshot':
            Ext.apply(this, {
                title: 'Take Snapshot',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Folder name',
                    value: this.config.selectedData.get('zfs_name')
                }]
            });
            break;
        case 'SnapshotClone':
            Ext.apply(this, {
                title: 'Snapshot Clone',
                items: [{
                    xtype: 'displayfield',
                    qDefault: true,
                    fieldLabel: 'Snapshot name',
                    value: this.config.selectedData.get('name')
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    fieldLabel: 'New Folder / LUN name'
                }]
            });
            break;
        case 'RollBack':
            Ext.apply(this, {
                title: 'Roll Back',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'Are you sure to roll back' + ' "' + this.config.selectedData.get('name') + '" ?'
                }]
            });
            break;
        case 'DeleteSnapshot':
            Ext.apply(this, {
                title: 'Delete Snapshot',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'Are you sure to delete' + ' "' + this.config.selectedData.get('name') + '" ?'
                }]
            });
            break;
        case 'SnapshotSchedule':
            Ext.apply(this, {
                title: 'Snapshot Schedule',
                items: [{
                    xtype: 'form',
                    items: [{
                        xtype: 'displayfield',
                        qDefault: true,
                        fieldLabel: 'Folder / LUN name',
                        value: this.config.selectedData
                    }, {
                        xtype: 'container',
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'radiofield',
                            qDefault: true,
                            indentLevel: 1,
                            boxLabel: 'Daily',
                            name: 'type',
                            inputValue: 'daily',
                            bind: {
                                value: '{sched_type}'
                            }
                        }]
                    }, {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'top'
                        },
                        items: [{
                            xtype: 'radiofield',
                            qDefault: true,
                            boxLabel: 'Weekly',
                            name: 'type',
                            inputValue: 'weekly',
                            indentLevel: 1,
                            listeners: {
                                change: function (radio, isChecked) {
                                    var ctn = radio.next('#weekDays');
                                    if (isChecked) {
                                        ctn.enable();
                                    } else {
                                        ctn.disable();
                                    }
                                }
                            }
                        }, {
                            xtype: 'checkboxgroup',
                            qDefault: true,
                            itemId: 'weekDays',
                            indentLevel: 1,
                            disabled: true,
                            columns: 3,
                            vertical: true,
                            // bind:{
                            //     value:'{sched_weekday}'
                            // },
                            items: [{
                                boxLabel: 'Monday',
                                name: 'week_day[]',
                                inputValue: '1'
                            }, {
                                boxLabel: 'Tuesday',
                                name: 'week_day[]',
                                inputValue: '2'
                            }, {
                                boxLabel: 'Wednesday',
                                name: 'week_day[]',
                                inputValue: '3'
                            }, {
                                boxLabel: 'Thursday',
                                name: 'week_day[]',
                                inputValue: '4'
                            }, {
                                boxLabel: 'Friday',
                                name: 'week_day[]',
                                inputValue: '5'
                            }, {
                                boxLabel: 'Saturday',
                                name: 'week_day[]',
                                inputValue: '6'
                            }, {
                                boxLabel: 'Sunday',
                                name: 'week_day[]',
                                inputValue: '0'
                            }]
                        }]
                    }, {
                        xtype: 'container',
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'radiofield',
                            qDefault: true,
                            boxLabel: 'Monthly',
                            name: 'type',
                            inputValue: 'monthly',
                            indentLevel: 1,
                            listeners: {
                                change: function (radio, isChecked) {
                                    var ctn = radio.next('#month');
                                    if (isChecked) {
                                        ctn.enable();
                                    } else {
                                        ctn.disable();
                                    }
                                }
                            }
                        }, {
                            name: 'month_day',
                            itemId: 'month',
                            xtype: 'combobox',
                            qDefault: true,
                            disabled: true,
                            editable: false,
                            width: 70,
                            matchFieldWidth: false,
                            allowBlank: false,
                            bind: {
                                store: '{monthstore}',
                                value: '{sched_monthday}'
                            },
                            queryMode: 'remote',
                            fields: ['monthvalue'],
                            valueField: 'monthvalue',
                            displayField: 'monthvalue',
                            value: 12
                        }]
                    }, {
                        xtype: 'container',
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'radiofield',
                            qDefault: true,
                            boxLabel: 'Repeat every',
                            name: 'type',
                            inputValue: 'repeat_hour',
                            indentLevel: 1,
                            listeners: {
                                change: function (radio, isChecked) {
                                    var ctn = radio.next('#repeathour');
                                    if (isChecked) {
                                        ctn.enable();
                                    } else {
                                        ctn.disable();
                                    }
                                }
                            }
                        }, {
                            name: 'repeat_hour',
                            itemId: 'repeathour',
                            cls: 'dis_combo',
                            xtype: 'combobox',
                            qDefault: true,
                            disabled: true,
                            editable: false,
                            width: 70,
                            matchFieldWidth: false,
                            allowBlank: false,
                            bind: {
                                store: '{reapethrstore}',
                                value: '{sched_repeat_hour}'
                            },
                            queryMode: 'remote',
                            fields: ['hourvalue'],
                            displayField: 'hourvalue',
                            valueField: 'hourvalue'
                        }, {
                            xtype: 'label',
                            qDefault: true,
                            text: 'Hour(s)'
                        }]
                    }, {
                        xtype: 'container',
                        customLayout: 'splitter'
                    }, {
                        xtype: 'container',
                        customLayout: 'hlayout',
                        items: [{
                            xtype: 'label',
                            qDefault: true,
                            text: 'Time'
                        }, {
                            name: 'start_hour',
                            cls: 'dis_combo',
                            xtype: 'combobox',
                            qDefault: true,
                            editable: false,
                            width: 70,
                            matchFieldWidth: false,
                            allowBlank: false,
                            bind: {
                                store: '{hrstore}',
                                value: '{sched_start_hour}'
                            },
                            queryMode: 'remote',
                            fields: ['hourvalue'],
                            displayField: 'hourvalue',
                            valueField: 'hourvalue'
                        }, {
                            xtype: 'label',
                            text: ':'
                        }, {
                            name: 'start_minute',
                            xtype: 'combobox',
                            qDefault: true,
                            editable: false,
                            cls: 'dis_combo',
                            width: 70,
                            matchFieldWidth: false,
                            allowBlank: false,
                            bind: {
                                store: '{minstore}',
                                value: '{sched_start_minute}'
                            },
                            queryMode: 'remote',
                            fields: ['minvalue'],
                            displayField: 'minvalue',
                            valueField: 'minvalue'
                        }, {
                            name: 'name',
                            xtype: 'textfield',
                            qDefault: true,
                            value: this.config.selectedData,
                            hidden: true
                        }]
                    }]
                }]
            });
            break;
        default:
            break;
        }
    },
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        itemId: 'confirm',
        buttonType: 'primary',
        listeners: {
            click: 'doConfirm'
        }
    }]
});
