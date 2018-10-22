Ext.define('DESKTOP.Folder.default.view.ShareFolderSettings', {
    /* Design UI layout*/
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    itemId: 'sharefoldersettings',
    requires: [
        'DESKTOP.Folder.default.controller.ShareFolderSettingsController',
        //'DESKTOP.Folder.default.model.ShareFolderSettingsModel'
    ],
    controller: 'sharefoldersettings',
    // viewModel: {
    //     type: 'sharefoldersettings'
    // },
    reference: 'shareFolderSettings',
    closeAction: 'destroy',
    title: 'Create Folder',
    titleAlign: 'center',
    closable: false,
    modal: true,
    width: 500,
    items: [
    {
        xtype: 'form',
        itemId: 'settingsForm',
        reference: 'settingsForm',
        //jsonSubmit: true,
        border: false,
        fieldDefaults: {
            labelWidth: 150,
            msgTarget: 'qtip'
        },
        items: [
        {
            xtype: 'label',
            qDefault: true,
            reference: 'titleLable',
            text: 'Create Folder',
            labelFontWeight: 'bold',
            labelFontColor: 'title'
        },{
            xtype: 'textfield',
            qDefault: true,
            name: 'folder_name',
            reference: 'folderName',
            fieldLabel: 'Folder name:',
            msgTarget: 'qtip',
            allowBlank: false,
            maxLength: 64
        },{
            xtype: 'textfield',
            qDefault: true,
            name: 'description',
            fieldLabel: 'Description:',
            msgTarget: 'qtip',
            allowBlank: true,
            maxLength: 64
        },{
            xtype: 'textfield',
            qDefault: true,
            name: 'pool',
            reference: 'pool',
            hidden: true,
            // bind: {
            //     value: '{currentVol.pool_name}'
            // }
        },{
            xtype: 'combobox',
            qDefault: true,
            name: 'volume',
            reference: 'volumeCombo',
            fieldLabel: 'Volume',
            queryMode: 'local',      // if not set to local, it will load twice
            valueField: 'vol_name',
            displayField: 'vol_name',
            editable: false,
            forceSelection: true,
            listeners: {
                select: 'onVolumeComboSelect'
            }
        },{
            xtype: 'label',
            qDefault: true,
            reference: 'volDescrip',
            hidden: false,
            // bind: {
            //     text: 'This folder will share the size of {currentVol.vol_name} unless enable Folder size (Quota) on it.'
            // }
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [
            {
                xtype: 'checkbox',
                qDefault: true,
                name: 'folder_size_box',
                reference: 'sizeBox',
                boxLabel: 'Folder size (Quota)',
                inputValue: true,
                uncheckedValue: false,
                listeners: {
                    change: 'onEnableFolderSize'
                }
            },{
                xtype: 'textfield',
                qDefault: true,
                name: 'folder_size',
                reference: 'sizeField',
                emptyText: '0 GB',
                disabled: true,
                allowBlank: false
            }]
        },
        {
            xtype: 'slider',
            qDefault: true,
            reference: 'sizeSlider',
            width: 360,
            disabled: true
        },
    /*    {
            xtype: 'progressbarslider',
            reference: 'sizeSlider',
            width: 360,
            disabled: true,
            progressbarConfig: {
                itemId: 'pool_used_percent_bar',
                bind: {
                    value: '{vm_pool_used_bar}'
                }
            },
            sliderConfig: {
                itemId: 'capacity_notification_thumb',
                bind: {
                    value: '{vm_pool_threshold}'
                },
                listeners: {
                    change: 'onDrag',
                    changecomplete: 'onDrag',
                    afterrender: 'unSetDirty'
                }
            }
        },*/
        {
            xtype: 'container',
            qDefault: true,
            reference: 'sizeContainer',
            layout: 'hbox',
            disabled: true,
            items: [
            {
                reference: 'totalVol',
                xtype: 'label',
                qDefault: true,
                width: 120
                // bind: {
                //     text: 'Volume size: {currentVol.total_gb} GB'
                // }
            },{
                reference: 'usedVol',
                xtype: 'label',
                qDefault: true,
                width: 120
                // bind: {
                //     text: 'Used: {currentVol.used_gb} GB'
                // }
            },{
                reference: 'availVol',
                xtype: 'label',
                qDefault: true,
                width: 120
                // bind: {
                //     text: 'Available: {currentVol.avail_gb} GB'
                // }
            }]
        },{
            xtype: 'checkbox',
            qDefault: true,
            name: 'hide_net_drive',
            boxLabel: 'Hide Network Drive',
            inputValue: true,
            uncheckedValue: false
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [
            {
                xtype: 'checkbox',
                qDefault: true,
                name: 'compression_box',
                reference: 'compressBox',
                boxLabel: 'Enable Compression',
                inputValue: true,
                uncheckedValue: false,
                listeners: {
                    change: 'onEnableCompression'
                }
            },{
                xtype: 'combobox',
                qDefault: true,
                name: 'compression',
                reference: 'compression',
                queryMode: 'local',
                valueField: 'value',
                displayField: 'str',
                editable: false,
                disabled: true,
                value: 'normal',    // select the first item
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'str'],
                    data: [
                    {
                        value: 'normal',
                        str: 'Normal'
                    }, {
                        value: 'zero',
                        str: 'Zero reclaim'
                    }, {
                        value: 'generic',
                        str: 'Generic zero reclaim'
                    }]
                })
            }]
        },{
            xtype: 'checkbox',
            qDefault: true,
            name: 'recycle_bin',
            boxLabel: 'Enable Recycle Bin',
            inputValue: true,
            uncheckedValue: false
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        qDefault: true,
        listeners: {
            click: 'onCancel'
        }
    }, {
        text: 'Confirm',
        qDefault: true,
        buttonType: 'primary',
        listeners: {
            click: 'onConfirm'
        }
    }]
});
