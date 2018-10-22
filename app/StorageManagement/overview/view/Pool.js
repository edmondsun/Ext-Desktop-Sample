Ext.define('DESKTOP.StorageManagement.overview.view.Pool', {
    extend: 'Ext.form.Panel',
    alias: 'widget.overviewpool',
    requires: [
        'DESKTOP.StorageManagement.overview.controller.PoolController',
        'DESKTOP.StorageManagement.overview.model.PoolModel'
    ],
    controller: 'overviewpool',
    viewModel: {
        type: 'overviewpool'
    },
    itemId: 'Pool',
    listeners: {
        beforedestroy: function () {
            var poolInfo = Ext.data.StoreManager.lookup('pool_info');
            clearInterval(poolInfo.polling);
        }
        //afterrender:'afterview'
    },
    width: 'auto',
    height: 550,
    waitMsgTarget: true,
    layout: {
        type: 'border'
    },
    items: [{
        region: 'south',
        xtype: 'panel',
        // scrollable: true,
        // split: true, // enable resizing
        border: 1,
        margin: '0 0 0 0',
        height: 250,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'grid',
            qDefault: true,
            flex: 1,
            forceFit: true,
            itemId: 'poolInfo',
            bind: {
                store: "{poolInfo}"
            },viewConfig: {
               loadMask: false
            },listeners: {
                select: 'selectPoolRow'
                // rowclick: function( gridView, record, tr, rowIndex, e, eOpts){
                //     console.warn(grid);
                // }
            },columns: [{
                text: 'Pool name',
                dataIndex: 'pool_name',
                sortable: false,
                hideable: false
            }]
        },{
            xtype: 'panel',
            flex: 1,
            margin: '0 0 0 0',
            padding: '0 10 0 10',
            items:[{
                xtype: 'title',
                qDefault: true,
                bind:{
                    text: "{currentPoolName}"
                }
            }, {
                xtype: 'polar',
                qDefault: true,
                itemId: 'pool_polar_chart',
                width: 100,
                height: 100,
                padding: 0,
                bodyPadding: 0,
                insetPadding: 0,
                innerPadding: 0,
                border: false,
                colors : ['#058be7', '#32c1c7', '#f1f1f1'],
                bind: {
                    store: '{pie}'
                },
                interactions: [],
                series: [{
                    type: 'pie',
                    angleField: 'capacity',
                    // label: {
                    //     field: 'item',
                    //     display: 'inside'
                    // },
                    // highlight: true,
                    subStyle: {
                        strokeStyle: ['#058be7', '#32c1c7', '#f1f1f1'],
                        lineWidth: [0, 0, 0]
                    },
                    tooltip: {
                        trackMouse: true,
                        style: 'background: #fff',
                        renderer: function(storeItem, item) {
                            this.setHtml(storeItem.get('item') + ': ' + storeItem.get('capacity') + 'GB' );
                        }
                    }
                }]
            }]
        },{
            xtype: 'form',
            flex: 1,
            items: [{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Folders:',
                name: 'vol_used_size',
                bind:{
                    value: '{foldersUsedGB}GB'
                }
            },{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'iSCSI:',
                name: 'lun_used_size',
                bind:{
                    value: '{iSCSIUsedGB}GB'
                }
            },{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Free:',
                name: 'free_size',
                bind:{
                    value: '{availableGB}GB'
                }
            },{
                xtype: 'displayfield',
                qDefault: true,
                fieldLabel: 'Total Size:',
                name: 'total_size',
                bind:{
                    value: '{totalGB}GB'
                }
            }]
        },{
            xtype: 'treepanel',
            qDefault: true,
            flex: 2,
            height: '100%',
            rootVisible: false,
            bind: {
                store: '{pool_composition}'
            },
            handler: function () { 
                console.log("this.getLoader()"); 
                console.log(this.getLoader()); 
                this.getLoader().load(this.root); 
            }
        }]
    },{
        region: 'west',
        xtype: 'panel',
        border: 1,
        width: 250,
        layout: {
            type: 'vbox'
        },
        defaults: { // defaults are applied to items, not the container
            width: 250
            // scrollable:true
        },
        items: [{
            xtype: 'label',
            text: 'Device'
        }, {
            xtype: 'combobox',
            qDefault: true,
            itemId: 'com_enc',
            width: 130,
            bind: {
                store: '{encInfoForPool}'
            },
            queryMode: 'local',
            itemId: 'com_enc',
            valueField: 'enc_id',
            displayField: 'enc_name',
            autoLoadOnValue: true,
            editable: false,
            listeners: {
                select:'onComboSelect'
            }
        }]
    }, {
        region: 'center', // center region is required, no width/height specified
        xtype: 'panel',
        border: 1,
        margin: '0 0 0 0',
        items: [{
            xtype: 'container',
            itemId: 'images',
            style: {
                marginTop: '50px'
            },
            width: 500,
            height: 300,
            layout: 'hbox',
            items: [{
                xtype: 'button',
                itemId: 'btnLeft',
                layout: 'absolute',
                width: 30,
                height: 70,
                listeners: {
                    click: 'on_leftBtn_click'
                }
            }, {
                xtype: 'container',
                style: {
                    marginLeft: '10px',
                    marginRight: '10px'
                },
                layout: 'absolute',
                itemId: 'drawing',
                width: 350,
                height: 200,
                border: true,
                items: [{
                    xtype: 'image',
                    width: 350,
                    src: 'app/StorageManagement/images/rack_24bay.png'
                }]
            }, {
                xtype: 'button',
                qDefault: true,
                width: 30,
                height: 70,
                itemId: 'btnRight',
                listeners: {
                    click: 'on_rightBtn_click'
                }
            }]
        }]
    }]
});
