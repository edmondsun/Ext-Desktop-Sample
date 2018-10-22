Ext.define('DESKTOP.StorageManagement.volume.view.VolumeExpand', {
    extend: 'Ext.window.Window',
    closeAction: 'destroy',
    requires: [
        'DESKTOP.StorageManagement.volume.model.VolumeModel',
        'DESKTOP.StorageManagement.volume.controller.VolumeExpandController'
    ],
    viewModel: {
        type: 'volume'
    },
    controller: 'volumeexpand',
    modal: true,
    width: 500,
    height: 330,
    resizable: false,
    itemId: 'volumeExpand',
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
                    text: 'Expand Volume',
                    style : {
                        'font-weight': 'bold',
                        'textAlign': 'left',
                        'font-size': '14px'
                    }
                }]
            },{
               xtype: 'container',
               customLayout: 'hlayout', 
               items: [{
                    itemId: 'volume_name',
                    xtype: 'displayfield',
                    fieldLabel: 'Volume name',
                    name: 'name',
                    width: 200
               }]
            },{
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    xtype: 'container',
                    customLayout: 'hlayout',
                    items: [{
                        itemId: 'expand_pool_name',
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
                        displayField: 'pool_name'
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
                    itemId: 'expand_volume_size',
                    fieldLabel: 'Volume size',
                    width: 200,
                    submitValue:false,
                    hiddenValue: 0,
                    listeners: {
                        blur: function(el,newVal,oldVal) {
                            var mainView  = Ext.ComponentQuery.query('#volumeExpand')[0];
                            var unit      = mainView.down('#expand_pool_unit').value;
                            var curSize   = Number(mainView.down('#expand_volume_size').getValue().split(unit)[0]);
                            var poolUsed  = mainView.down('#expand_pool_used').hiddenValue;
                            var poolAvail = mainView.down('#expand_pool_avail').hiddenValue;
                            var poolSize  = mainView.down('#expand_pool_size').hiddenValue;

                            switch(unit) {
                            case 'TB':
                                poolSize = poolSize/1024;
                                poolUsed = poolUsed/1024;
                                mainView.down('#expand_volume_size').hiddenValue = curSize*1024;
                                break;
                            case 'GB':
                                mainView.down('#expand_volume_size').hiddenValue = curSize;
                                break;    
                            }

                            if (curSize < poolAvail) {
                                mainView.down('#expand_pool_slider').setValue(curSize + poolUsed);
                            } else {
                                mainView.down('#expand_volume_size').setValue(poolAvail);
                                mainView.down('#expand_pool_slider').setValue(poolSize);
                            }
                        }
                    }
               },,{
                    xtype: 'textfield',
                    hidden: true,
                    name: 'size_mb'
               },{
                    itemId: 'expand_pool_unit',
                    xtype: 'combobox',
                    submitValue:false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['SizeType'],
                        data: [{
                            "SizeType": "TB"
                        },{
                            "SizeType": "GB"
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
                itemId: 'expand_pool_slider',
                xtype: 'slider',
                width: 300,
                submitValue:false,
                decimalPrecision : 2,
                listeners: {
                    change: function(el,newVal,oldVal) {
                        var mainView  = Ext.ComponentQuery.query('#volumeExpand')[0];
                        var unit      = mainView.down('#expand_pool_unit').value;
                        var curSize   = mainView.down('#expand_pool_slider').getValue();
                        var poolSize  = mainView.down('#expand_pool_size').hiddenValue;
                        var poolUsed  = mainView.down('#expand_pool_used').hiddenValue;
                        var poolAvail = mainView.down('#expand_pool_avail').hiddenValue;
                        var poolInfo  = [];
                        var curAvail;

                        switch(unit) {
                        case 'TB':
                            poolSize = poolSize/1024;
                            poolUsed = poolUsed/1024;

                            poolInfo['poolSize']  = poolSize/1024;
                            poolInfo['poolUsed']  = poolUsed/1024;
                            poolInfo['poolAvail'] = poolAvail/1024;
                            if ((curSize != 0) && (curSize*1024 - poolUsed) > 0)
                                mainView.down('#expand_volume_size').hiddenValue = curSize*1024 - poolUsed;
                            else
                                mainView.down('#expand_volume_size').hiddenValue = 0;
                            break;

                        case 'GB':
                            poolInfo['poolSize']  = poolSize;
                            poolInfo['poolUsed']  = poolUsed;
                            poolInfo['poolAvail'] = poolAvail;
                            if ((curSize != 0) && (curSize*1024 - poolUsed) > 0)
                                mainView.down('#expand_volume_size').hiddenValue = curSize - poolUsed;
                            else
                                mainView.down('#expand_volume_size').hiddenValue = 0;
                            break;    
                        }

                        if (newVal <= poolInfo.poolUsed) {
                            mainView.down('#expand_pool_slider').setValue(poolInfo.poolUsed);
                            mainView.down('#expand_volume_size').setValue(0);
                        } else {

                            curAvail = mainView.down('#expand_pool_slider').getValue();

                            if (curAvail <= poolInfo.poolAvail) {
                                mainView.down('#expand_volume_size').setValue(curAvail - poolInfo.poolUsed);
                            } else {
                                mainView.down('#expand_volume_size').setValue(poolInfo.poolAvail);
                            }
                        }
                    }
                },
                minValue: 0,
                maxValue: 100
            },{
                xtype: 'container',
                customLayout: 'hlayout',
                items: [{
                    itemId: 'expand_pool_size',
                    xtype: 'displayfield',
                    fieldLabel: 'Pool size:',
                    hiddenValue: 0,
                    bind: {
                        value: '{PoolSize}'
                    }
                },{
                    itemId: 'expand_pool_used',
                    xtype: 'displayfield',
                    fieldLabel: 'Used:',
                    hiddenValue: 0,
                    bind: {
                        value: '{PoolUsed}'
                    }
                },{
                    itemId: 'expand_pool_avail',
                    xtype: 'displayfield',
                    fieldLabel: 'Available:',
                    hiddenValue: 0,
                    bind: {
                        value: '{PoolAvailable}'
                    }
                }]
            }]
        }],
        buttons: ['->', {
            text: 'Cancel',
            listeners: {
                click: 'onCancel'
            }
        }, {
            text: 'Apply',
            listeners: {
                click: 'onApply'
            }
        }]        
    }]
});
