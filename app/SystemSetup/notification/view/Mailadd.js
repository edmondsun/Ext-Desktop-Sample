Ext.define('DESKTOP.SystemSetup.notification.view.Mailadd', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    requires: [
        'DESKTOP.SystemSetup.notification.model.MailModel'
    ],
    controller: 'mail',
    //bodyPadding : 20,
    closeAction: 'destroy',
    modal: true,
    title: 'Add Mail-to address',
    width: 500,
    resizable: false,
    items: [{
        xtype: 'form',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'textfield',
                    qDefault: true,
                    name: 'mail_to',
                    itemId: 'mailaddr',
                    fieldLabel: 'Mail Address:',
                    vtype: 'email'
                }]
            }, {
                xtype: 'container',
                qDefault: true,
                customLayout: 'hlayout',
                items: [{
                    xtype: 'checkboxgroup',
                    qDefault: true,
                    columns: 4,
                    vertical: true,
                    items: [{
                        boxLabel: 'Alerts',
                        name: 'filter',
                        inputValue: 4,
                        uncheckedValue: 0
                    }, {
                        boxLabel: 'Warning',
                        name: 'filter',
                        inputValue: 2,
                        uncheckedValue: 0
                    }, {
                        boxLabel: 'Error',
                        name: 'filter',
                        inputValue: 1,
                        uncheckedValue: 0
                    }, {
                        boxLabel: 'Backup events',
                        name: 'filter',
                        inputValue: 8,
                        uncheckedValue: 0
                    }]
                }]
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        buttonType: 'cancel',
        qDefault: true,
        listeners: {
            click: function () {
                this.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        qDefault: true,
        buttonType: 'primary',
        listeners: {
            click: 'mail_ok'
        }
    }]
});
