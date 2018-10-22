Ext.define('DESKTOP.StorageManagement.disk.view.ReplaceDisk', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    closeAction: 'destroy',
    title: 'Replace Disk window',
    controller: 'disk',
    width: 800,
    modal: true,
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                itemId: 'pool',
                fieldLabel: 'Pool Name :',
                value: ''
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                itemId: 'slot',
                fieldLabel: 'Slot No. :',
                value: ''
            }]
        }, {
            xtype: 'displayfield',
            qDefault: true,
            itemId: 'pd_id',
            value: '',
            hidden: true
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                itemId: 'diskLabel',
                text: 'Available disk(s)'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'gridpanel',
                qDefault: true,
                itemId: 'repalceInfo',
                selModel: {
                    selType: 'checkboxmodel',
                    mode: 'SINGLE',
                    allowDeselect: true,
                    headerWidth: 45
                },
                forceFit: true,
                width: '100%',
                columns: [
                    // {
                    //     xtype: 'checkcolumn',
                    //     qDefault: true,
                    //     resizable: false,
                    //     dataIndex: 'selection',
                    //     menuDisabled: true,
                    //     sortable: false,
                    //     width: 80,
                    //     renderer: function (val, me, rec) {
                    //         return (new Ext.ux.CheckColumn()).renderer(val);
                    //     },
                    //     listeners: {
                    //         checkchange: 'on_replace_selectChange'
                    //     }
                    // },
                    // {
                    //     text: 'Select',
                    //     dataIndex: 'pd_id',
                    //     sortable: false,
                    //     hideable: false,
                    //     width: 80,
                    //     menuDisabled: true,
                    //     resizable: false,
                    //     renderer: function (value) {
                    //         return "<input type='radio' name = 'primaryRadio'>";
                    //     }
                    // },
                    {
                        text: 'Enclosure',
                        sortable: false,
                        menuDisabled: true,
                        flex: 1,
                        // width: 100,
                        resizable: false,
                        renderer: function () {
                            return Ext.ComponentQuery.query('#Disk')[0].down('combo').getRawValue();
                        }
                    }, {
                        text: 'Slot No.',
                        dataIndex: 'slot',
                        sortable: false,
                        // width: 80,
                        flex: 1,
                        resizable: false,
                        menuDisabled: true
                    }, {
                        text: 'Capacity',
                        dataIndex: 'size_gb',
                        // width: 100,
                        flex: 1,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true,
                        renderer: function (val) {
                            return val + " GB";
                        }
                    }, {
                        text: 'Status',
                        dataIndex: 'status',
                        // width: 80,
                        flex: 1,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true
                    }, {
                        text: 'Usage',
                        dataIndex: 'usage',
                        // width: 120,
                        flex: 1,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true
                    }, {
                        text: 'Vendor',
                        dataIndex: 'vendor',
                        // width: 80,
                        flex: 1,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true
                    }, {
                        text: 'Rate',
                        dataIndex: 'rate',
                        sortable: false,
                        resizable: false,
                        menuDisabled: true
                    }
                ]
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            itemId: 'noReplace',
            hidden: true,
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                value: 'No available disks have been found.'
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        itemId: 'btnCancel',
        listeners: {
            click: function () {
                this.up('window').destroy();
            }
        }
    }, {
        text: 'Apply',
        itemId: 'btnStop',
        handler: 'on_replace_apply',
        buttonType: 'primary'
    }]
});
