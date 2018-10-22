Ext.define('DESKTOP.Folder.default.view.NfsHostSetting', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    alias: 'widget.window_nfshostsetting',
    requires: [
        'DESKTOP.Folder.default.controller.NfsHostSettingController'
    ],
    controller: 'nfshostset',
    resizable: false,
    closeAction: 'destroy',
    width: 600,
    modal: true,
    bodyPadding: 20,
    waitMsgTarget: true,
    config: {
        /**
         * actionType: 'AddNFSHost/DeleteNFSHost'
         * default: ''
         */
        actionType: ''
    },
    applyActionType: function (value) {
        if (value.length === 0) {
            return;
        }
        switch (value) {
        case 'AddNFSHost':
            Ext.apply(this, {
                title: 'Add NFS Host',
                items: [{
                    xtype: 'form',
                    items: [{
                        xtype: 'textfield',
                        qDefault:true,
                        fieldLabel: 'IP address or domain',
                        allowBlank: false
                    }, {
                        xtype: 'combobox',
                        qDefault:true,
                        fieldLabel: 'Access right',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'str'],
                            data: [{
                                "value": 'ro',
                                "str": "Read only"
                            }, {
                                "value": 'rw',
                                "str": "Read/Write"
                            }]
                        }),
                        valueField: 'value',
                        displayField: 'str',
                        mode: 'local',
                        value: 'ro'
                    }, {
                        xtype: 'checkbox',
                        qDefault:true,
                        boxLabel: 'Root squash',
                        itemId: 'root_squash'
                        // inputValue: 'root_squash',
                        // uncheckedValue: 'no_root_squash'
                    }, {
                        xtype: 'checkbox',
                        qDefault:true,
                        boxLabel: 'Async write',
                        itemId: 'async'
                        // inputValue: 'async',
                        // uncheckedValue: 'sync'
                    }]
                }]
            });
            break;
        case 'DeleteNFSHost':
            Ext.apply(this, {
                title: 'Delete NFS Host',
                layout: 'vbox',
                items: [{
                    xtype: 'form',
                    items: [{
                        xtype: 'label',
                        qDefault:true,
                        text: 'Are you sure to delete NFS Host allow IP address or domain'
                    }, {
                        xtype: 'label',
                        qDefault:true,
                        text: this.config.selectedData.host
                    }]
                }]
            });
            break;
        case 'EditNFSHost':
            Ext.apply(this, {
                title: 'Edit NFS Host',
                layout: 'vbox',
                items: [{
                    xtype: 'form',
                    items: [{
                        xtype: 'textfield',
                        qDefault:true,
                        fieldLabel: 'IP address or domain',
                        allowBlank: false,
                        value: this.config.selectedData.host
                    }, {
                        xtype: 'combobox',
                        qDefault:true,
                        fieldLabel: 'Access right',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'str'],
                            data: [{
                                "value": 'ro',
                                "str": "Read only"
                            }, {
                                "value": 'rw',
                                "str": "Read/Write"
                            }]
                        }),
                        valueField: 'value',
                        displayField: 'str',
                        mode: 'local',
                        value: this.config.selectedData.perm
                    }, {
                        xtype: 'checkbox',
                        qDefault:true,
                        boxLabel: 'Root squash',
                        itemId: 'root_squash',
                        value: this.config.selectedData.root_squash
                    }, {
                        xtype: 'checkbox',
                        qDefault:true,
                        boxLabel: 'Async write',
                        itemId: 'async',
                        value: this.config.selectedData.async
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
        qDefault: true,
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        qDefault: true,
        itemId: 'confirm',
        buttonType: 'primary',
        listeners: {
            click: 'doConfirm'
        }
    }]
});
