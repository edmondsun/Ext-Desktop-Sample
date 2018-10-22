Ext.define('DESKTOP.Folder.default.view.CreateShareFolder', {
    /* Design UI layout*/
    extend: 'Ext.window.Window',
    itemId: 'createshare',
    requires: [
        'DESKTOP.Folder.default.controller.CreateShareFolderController',
        'DESKTOP.Folder.default.model.CreateShareFolderModel'
    ],
    controller: 'createshare',
    viewModel: {
        type: 'createshare'
    },
    reference: 'createshareWindow',
    closeAction: 'destroy',
    title: 'Create Folder',
    modal: true,
    items: [
    {
        xtype: 'form',
        itemId: 'settingForm',
        reference: 'settingForm',
        border: false,
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },
        items: [
        {
            xtype: 'label',
            reference: 'titleLable',
            text: 'Create Folder',
            labelFontWeight: 'bold',
            labelFontColor: 'title'
        },{
            xtype: 'textfield',
            fieldLabel: 'Folder name:',
            name: 'folder_name',
            reference: 'folder_name',
            itemId: 'create_folder_name',
            msgTarget: 'qtip',
            allowBlank: false,
            maxLength: 64
        },{
            xtype: 'textfield',
            fieldLabel: 'Description:',
            name: 'description',
            itemId: 'create_descrip',
            msgTarget: 'qtip',
            allowBlank: true,
            maxLength: 64
        },{
            xtype: 'textfield',
            name: 'pool',
            reference: 'pool',
            hidden: true,
            bind: {
                value: '{currentVol.pool_name}'
            }
        },{
            xtype: 'combobox',
            name: 'volume',
            fieldLabel: 'Volume',
            reference: 'volumeCombo',
            itemId: 'volume',
            queryMode: 'local',      // if not set to local, it will load twice
            valueField: 'vol_name',
            displayField: 'vol_pool',
            editable: false,
            forceSelection: true,
            bind: {
                store: '{volumeAll}'
            }
        /*    
            listeners: {
                select: 'onVolumeComboSelect',
            }
        */
        },{
            xtype: 'label',
            reference: 'volDescrip',
            hidden: false,
            bind: {
                text: 'This folder will share the size of {currentVol.vol_name} unless enable Folder size (Quota) on it.'
            }
        },{
            xtype: 'container',
            customLayout: 'hlayout',
            items: [
            {
                xtype: 'checkbox',
                boxLabel: 'Folder size (Quota)',
                listeners: {
                    change: 'onEnableFolderSize'
                }
            },{
                xtype: 'textfield',
                name: 'folder_size',
                itemId: 'sizeField',
                reference: 'sizeField',
                emptyText: '0 GB',
                disabled: true,
                allowBlank: false
            }]
        },
        {
            xtype: 'slider',
            reference: 'sizeSlider',
            width: 360,
            disabled: true
        },
        // {
        //     xtype: 'progressbarmultislider',
        //     width: '100%',
        //     progressbarConfig: {
        //         itemId: 'pool_used_percent_bar',
        //         bind: {
        //             value: '{vm_pool_used_bar}'
        //         }
        //     },
        //     multisliderConfig: {
        //         itemId: 'capacity_notification_thumb',
        //         bind: {
        //             value: '{vm_pool_threshold}'
        //         },
        //         listeners: {
        //             change: 'onDrag',
        //             changecomplete: 'onDrag',
        //             afterrender: 'unSetDirty'
        //         }
        //     }
        // },
        {
            xtype: 'container',
            reference: 'sizeContainer',
            layout: 'hbox',
            disabled: true,
            defaults: {
                xtype: 'label',
                width: 120
            },
            items: [
            {
                reference: 'totalVol',
                bind: {
                    text: 'Volume size: {currentVol.total_gb} GB'
                }
            },{
                reference: 'usedVol',
                bind: {
                    text: 'Used: {currentVol.used_gb} GB'
                }
            },{
                reference: 'availVol',
                bind: {
                    text: 'Available: {currentVol.avail_gb} GB'
                }
            }]
        },{
            xtype: 'checkbox',
            boxLabel: 'Hide Network Drive',
            name: 'hide_net_drive',
            inputValue: true
        },{
            xtype: 'container',
            customLayout: 'hlayout',
            items: [
            {
                xtype: 'checkbox',
                boxLabel: 'Enable Compression',
                listeners: {
                    change: 'onEnableCompression'
                }
            },{
                xtype: 'combobox',
                name: 'compression',
                reference: 'compression',
                queryMode: 'local',
                valueField: 'value',
                displayField: 'str',
                editable: false,
                disabled: true,
                bind: {
                    store: '{compressionOptions}'
                },
                listeners: {
                    render: function (combo) {
                        combo.select('zero');
                    }
                }
            }]
        },{
            xtype: 'checkbox',
            boxLabel: 'Enable Recycle Bin',
            name: 'recycle_bin',
            inputValue: true
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        handleMouseEvents: false,
        listeners: {
            click: 'onCancel'
        }
    }, {
        text: 'Confirm',
        listeners: {
            click: 'onConfirm'
        }
    }]
});
