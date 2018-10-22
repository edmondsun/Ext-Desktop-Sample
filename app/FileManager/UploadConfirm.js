Ext.define('DESKTOP.FileManager.UploadConfirm', {
    extend: 'DESKTOP.ux.qcustomize.window.SubWindow',
    alias: 'widget.uploadconfirm',
    modal: false,
    width: 600,
    height: 300,
    resizable: false,
    title: 'Upload confirm',
    items: [{
        xtype: 'container',
        qDefault: true,
        customLayout: 'vlayout',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                text: 'For files with the same name, what do you want to handle them ?'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'radiogroup',
                qDefault: true,
                layout: 'vbox',
                itemId: 'radioChoice',
                width: '100%',
                items: [{
                    xtype: 'radiofield',
                    qDefault: true,
                    checked: true,
                    boxLabel: 'Skip the files',
                    name: 'mode',
                    inputValue: 0
                }, {
                    xtype: 'container',
                    qDefault: true,
                    customLayout: 'splitter'
                }, {
                    xtype: 'radiofield',
                    qDefault: true,
                    boxLabel: 'Overwrite the files',
                    name: 'mode',
                    inputValue: 1
                }]
            }]
        }]
    }],
    buttons: ['->', {
        text: 'Cancel',
        listeners: {
            click: function (me) {
                me.up('window').close();
            }
        }
    }, {
        text: 'Confirm',
        handler: function (me) {
            var main = Ext.ComponentQuery.query('#appwindow')[0];
            var choice = me.up('window').down('#radioChoice').getValue().mode;
            main.getViewModel().set('fileChoice', choice);
            me.up('window').close();
            main.getController().fileUpload();
        }
    }]
});
