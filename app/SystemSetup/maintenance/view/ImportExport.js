Ext.define('DESKTOP.SystemSetup.maintenance.view.ImportExport', {
    extend: 'Ext.form.Panel',
    alias: 'widget.importexport',
    requires: [
        'DESKTOP.SystemSetup.maintenance.controller.ImportExportController'
    ],
    controller: 'importexport',
    itemId: 'ImportExport',
    title: "Import/Export",
    frame: true,
    collapsible: true,
    waitMsgTarget: true,
    fieldDefaults: {
        //labelWidth : 150,
        msgTarget: 'qtip'
    },
    trackResetOnLoad: true,
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
                qDefault: true,
                labelFontColor: 'title',
                labelFontWeight: 'bold',
                text: 'Import configuration file'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'filefield',
                qDefault: true,
                customType: 'file',
                name: 'cfg_file',
                fieldLabel: 'Select file',
                allowBlank: false,
                buttonText: 'Browse...'
            }, {
                xtype: 'button',
                qDefault: true,
                text: 'Import',
                listeners: {
                    click: 'doImport'
                }
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'splitter'
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                labelFontColor: 'title',
                labelFontWeight: 'bold',
                text: 'Export configuration file'
            }]
        }, {
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'label',
                qDefault: true,
                text: 'Click "Export" to export configuration file '
            }, {
                xtype: 'button',
                qDefault: true,
                text: 'Export',
                listeners: {
                    click: 'doExport'
                }
            }]
        }]
    }]
});
