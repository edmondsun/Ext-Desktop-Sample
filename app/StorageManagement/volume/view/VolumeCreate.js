Ext.define('DESKTOP.StorageManagement.volume.view.VolumeCreate', {
    extend: 'Ext.window.Window',
    closeAction: 'destroy',
    requires: [
        'DESKTOP.StorageManagement.volume.model.VolumeModel',
        'DESKTOP.StorageManagement.volume.controller.VolumeCreateController'
    ],
    viewModel: {
        type: 'volume'
    },
    controller: 'volumecreate',
    modal: true,
    width: 500,
    height: 330,
    resizable: false,
    itemId: 'volumeCreate',
    listeners: {
        afterrender:'afterview'
    },
    items: [{
        xtype: 'form',
        bodyPadding: '5 10 10 10',
        width: 500,
        items:[{
            xtype: 'container',
            customLayout: 'vlayout',        
            items: [{
                xtype: 'container',
                customLayout: 'hlayout',   
                items: [{
                    xtype: 'label',
                    text: 'Create Volume',
                    style : {
                        'font-weight': 'bold',
                        'textAlign': 'left',
                        'font-size': '14px'
                    }
                }]
            },{
               xtype: 'container',
               customLayout: 'hlayout', 
               itemId: 'volume_name',
               items: [{
                    xtype: 'textfield',
                    name: 'name',
                    width: 200,
                    msgTarget: 'qtip',
                    allowBlank: false,
                    validator: function () {
                        var pattern1 = /^[a-zA-Z0-9-_.]+$/;
                        var pattern2 = /^\.|\.$/;

                        if (this.getValue().match(pattern1) === null) {
                            return 'Characters which are allowed include:"a-z A-Z 0-9 - _ . "';
                        } else {

                            if (this.getValue().match(pattern2) !== null) {
                                return 'Characters which are not allowed "." at first or at end';
                            } else {
                                return true;
                            }
                        }
                    },
                    regexText: 'Name contains characters which are not allowed.',
                    fieldLabel: 'Volume name'
               }]
            },{
                xtype: 'container',
                customLayout: 'hlayout',
                itemId: 'volume_location',
                items: [{
                    xtype: 'container',
                    customLayout: 'hlayout',
                    items: [{
                        itemId: 'create_pool_name',
                        name: 'pool_name',
                        xtype: 'combobox',
                        width: 200,
                        editable: false,
                        bind: {
                            store: '{poolInfo}'
                        },
                        queryMode: 'local',
                        fieldLabel: 'Location',
                        valueField: 'pool_name',
                        displayField: 'pool_name',
                        listeners: {
                            select: 'onPoolLocationClick'
                        }
                    }]
                }]
            },{
               xtype: 'container',
               customLayout: 'hlayout', 
               items: [{
                    xtype: 'textfield',
                    allowBlank: false,
                    msgTarget: 'qtip',
                    maskRe: /[\d\.]/,
                    regex: /[0-9]/,
                    reference: 'create_volume_size',
                    itemId: 'create_volume_size',
                    fieldLabel: 'Volume size',
                    width: 200,
                    submitValue:false,
                    hiddenValue: 0,
                    enableKeyEvents: true,
                    decimalPrecision : 2
               },{
                    xtype: 'textfield',
                    itemId: 'conversion_volume_size',
                    hidden: true,
                    name: 'size_mb'
               },{
                    itemId: 'create_pool_unit',
                    xtype: 'combobox',
                    submitValue:false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['SizeType'],
                        data: [{
                            'SizeType': 'TB'
                        }, {
                            'SizeType': 'GB'
                        }]
                    }),
                    listeners: {
                        change: 'onPoolUnitClick'
                    },
                    displayField: 'SizeType',
                    value: 'GB',
                    width: 70,
                    editable: false
               }]
            },{
                // x: 0,
                // y: 0,
                // xtype: 'progressbar',
                // width: 300,
                // height: 10,
                // value: 0.03,
                // listeners: {
                //     update: function (obj, loadScripts, callback, me) {
                //         obj.text = '';
                //         return me;
                //     }
                // }
            },{
                x: 0,
                y: 0,
                reference: 'create_pool_slider',
                itemId: 'create_pool_slider',
                xtype: 'slider',
                width: 300,
                submitValue:false,
                decimalPrecision : 2,
                minValue: 0,
                maxValue: 100
            },{
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    xtype: 'displayfield',
                    itemId: 'create_pool_total_size',
                    fieldLabel: 'Pool size:',
                    bind: {
                        value: '{PoolSize}'
                    },
                    hiddenValue: 0
                },{
                    xtype: 'displayfield',
                    itemId: 'create_pool_used_size',
                    fieldLabel: 'Used:',
                    bind: {
                        value: '{PoolUsed}'
                    },
                    hiddenValue: 0
                },{
                    xtype: 'displayfield',
                    itemId: 'create_pool_available_size',
                    fieldLabel: 'Available:',
                    bind: {
                        value: '{PoolAvailable}'
                    },
                    hiddenValue: 0
                }]
            }]
        }],
        buttons: ['->', {
            text: 'Cancel',
            listeners: {
                click: function() {
                    var me = this;
                    me.up('window').close();
                }
            }
        }, {
            text: 'Apply',
            listeners: {
                click: 'onApply'
            }
        }]        
    }]
});
