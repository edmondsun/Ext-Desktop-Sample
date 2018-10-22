Ext.define('DESKTOP.Folder.default.view.WindowsNetworkHostSetting', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    closeAction: 'destroy',
    alias: 'widget.window_windowsnetworkhost',
    requires: [
        'DESKTOP.Folder.default.controller.WindowsNetworkHostSettingController'
    ],
    controller: 'windowsnetworkhostset',
    resizable: false,
    width: 600,
    modal: true,
    bodyPadding: 20,
    waitMsgTarget: true,
    config: {
        /**
         * actionType: 'AddNFSHost/DeleteNFSHost'
         * default: ''
         */
        actionType: '',
        shar_name: '',
        rpath: '',
        caller: '',
        store: ''
    },
    applyActionType: function (value) {
        if (value.length === 0) {
            return;
        }
        switch (value) {
        case 'AddWindowsNetworkHost':
            Ext.apply(this, {
                title: 'Add Windows network host',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'Allow IP address or domain'
                }, {
                    xtype: 'textfield',
                    qDefault: true,
                    itemId: 'text_ip',
                    allowBlank: false,
                    regexText: 'Invalid IP address or domain name',
                    width: 200,
                    validator: function (val) {
                        var pattern = /[^0-9a-zA-Z_\.\s-\/]/;
                        var existPattern = /[0-9a-zA-Z]/;
                        if (val.match(/[\.]/) !== null && (val.match(pattern) === null && val.match(existPattern) !== null) || val === 'ALL') {
                            return true;
                        } else {
                            return this.regexText;
                        }
                    }
                }]
            });
            break;
        case 'DeleteWindowsNetworkHost':
            Ext.apply(this, {
                title: 'Delete Windows network host',
                layout: 'vbox',
                items: [{
                    xtype: 'label',
                    qDefault: true,
                    text: 'Are you sure to delete NFS Host allow IP address or domain'
                }, {
                    xtype: 'label',
                    qDefault: true,
                    text: this.config.selectedData
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
