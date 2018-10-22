Ext.define('DESKTOP.StorageManagement.iscsi.view.GeneralLun', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lunview',
    requires: [
        'DESKTOP.StorageManagement.iscsi.model.GeneralLunModel',
        'DESKTOP.StorageManagement.iscsi.controller.GeneralLunController',
        'Ext.slider.Single'
    ],
    controller: 'lunsetting',
    viewModel: {
        type: 'lunsetting'
    },
    itemId: 'generateLunView',
    reference: 'generateLunView',
    modelValidation: true,
    hidden: true,
    items: [{
        itemId: 'lun',
        xtype: 'form',
        bodyPadding: '5 10 10 10',
        fieldDefaults: {
            labelWidth: 100,
            msgTarget: 'qtip'
        },        
        items: [{
            xtype: 'textfield',
            itemId: 'lun_name',
            fieldLabel: 'LUN Name',
            name: 'lun_name',
            oriValue: null,
            allowBlank: false,
            msgTarget: 'qtip',
            maskRe: /^[a-zA-Z0-9-_.]+$/,
            regexText: 'Name contains characters which are not allowed.'
        }, {
            xtype: 'combobox',
            itemId: 'lun_location',
            fieldLabel: 'LUN Location',
            readOnly: true,
            editable: false,
            name: 'pool_name',
            queryMode: 'local',
            valueField: "pool_name",
            displayField: 'pool_name',
            listeners: {
                select: 'onPoolNameChange'
            }
        }, {
            xtype: 'container',
            padding: '0 0 0 0',
            layout: 'fit',
            width: 300,
            items: [{
                x: 0,
                y: 0,
                xtype: 'progressbar',
                itemId: 'pool_used_percent_bar',
                width: 300
            }, {
                x: 0,
                y: 0,
                xtype: 'slider',
                itemId: 'pool_capacity',
                width: 300,
                listeners: {
                    change: function (el, newVal, oldVal) {
                        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
                        var unit = mainView.down('#lun_unit_size').value;
                        var poolUsed = mainView.down('#lun_pool_used').value.split(unit)[0];
                        var poolSize = mainView.down("#lun_pool_size").value.split(unit)[0];
                        var thin = mainView.down('#lun_thin_provsioning').checked;
                        switch (thin) {
                        case true:
                            mainView.down("#lun_capacity").setValue(newVal);
                            break;
                        case false:
                            if (newVal <= Number(poolUsed)) {
                                mainView.down("#lun_capacity").setValue(0);
                                mainView.down("#pool_capacity").setValue(Number(poolUsed));
                            } else {
                                mainView.down("#lun_capacity").setValue(newVal - Number(poolUsed));
                            }
                            mainView.down("#pool_used_percent_bar").setValue(Number(poolUsed) / Number(poolSize));
                            break;
                        }
                    }
                },
                margin: '-20 0 0 0',
                minValue: 0,
                maxValue: 100
            }]
        }, {
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    itemId: 'lun_pool_size',
                    xtype: 'displayfield',
                    fieldLabel: 'Pool size:',
                	reference: 'lun_pool_size',
                	hValue: null
                },{
                    itemId: 'lun_pool_used',
                    xtype: 'displayfield',
                    fieldLabel: 'Used:',
                    reference: 'lun_pool_used',
                    hValue: null
                },{
                    itemId: 'lun_pool_available',
                    xtype: 'displayfield',
                    fieldLabel: 'Available:',
                    reference: 'lun_pool_available',
                    hValue: null
                }]
        }, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'textfield',
                itemId: 'lun_capacity',
                fieldLabel: 'Capacity:',
                valueField: '',
                pValue: null,
                handler: 'onCapacity',
                allowBlank: false,
                msgTarget: 'qtip',
                maskRe: /[\d\.]/,
                regexText: 'Capacity contains characters which are not allowed.',
                listeners: {
                    blur: function (el) {
                        var val = el.getValue().trim();
                        var mainView = Ext.ComponentQuery.query('#generateLunView')[0];
                        var unit = mainView.down('#lun_unit_size').value;
                        var thin = mainView.down('#lun_thin_provsioning').checked;
                        var poolSize = mainView.down("#lun_pool_size").value.split(unit)[0];
                        var usedSize = mainView.down("#lun_pool_used").value.split(unit)[0];
                        var limitSize;
                        if (thin) {
                            limitSize = Number(poolSize);
                        } else {
                            limitSize = Number(poolSize) - Number(usedSize);
                        }
                        if (val <= limitSize && val >= 0) {
                            mainView.down('#lun_capacity').pValue = Number(mainView.down("#lun_capacity").value);
                        } else if (val > limitSize) {
                            mainView.down("#lun_capacity").setValue(Number(limitSize));
                            mainView.down('#lun_capacity').pValue = Number(limitSize);
                        }
                    }
                }
            }, {
                xtype: 'combobox',
                itemId: 'lun_unit_size',
                width: 60,
                editable: false,
                style: {
                    marginLeft: '5px'
                },
                store: Ext.create('Ext.data.Store', {
                    fields: ['SizeType'],
                    data: [{
                        "SizeType": "TB"
                    }, {
                        "SizeType": "GB"
                    }]
                }),
                displayField: 'SizeType',
                value: "GB",
                listeners: {
                    select: 'onUnitSizeChange'
                }
            }]
        }, {
            xtype: 'checkboxfield',
            itemId: 'lun_thin_provsioning',
            boxLabel: 'Enable Thin provsioning',
            inputValue: 1,
            uncheckedValue: 0,
            handler: 'onProvsion'
        }, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'checkboxfield',
                itemId: 'lun_enable_compression',
                boxLabel: 'Enable Compression',
                inputValue: 'enable',
                uncheckedValue: 'disable',
                pValue: null,
                handler: 'onCompression'
            }, {
                xtype: 'combobox',
                itemId: 'lun_compression_type',
                style: {
                    marginLeft: '20px'
                },
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['CompressionType'],
                    data: [{
                        "CompressionType": "Enable"
                    }, {
                        "CompressionType": "Zero Reclaim"
                    }, {
                        "CompressionType": "Generic zero Reclaim"
                    }]
                }),
                displayField: 'CompressionType',
                value: "Zero Reclaim",
                listeners: {
                    select: 'onCompressSelect'
                }
            }]
        }]
    }, {
        hidden: true,
        reference: 'select_lun_btn',
        buttons: [{
            itemId: 'btn_cancel',
            text: 'Cancel'
        }, {
            itemId: 'btn_confirm',
            text: 'Confirm'
        }]
    }, {
        hidden: true,
        reference: 'select_winzard_lun_btn',
        buttons: [{
            itemId: 'btn_winzard_cancel',
            text: 'Cancel'
        }, {
            itemId: 'btn_winzard_back',
            text: 'Back'
        }, {
            itemId: 'btn_winzard_confirm',
            text: 'Confirm'
        }]
    }]
});
