Ext.define('DESKTOP.Desktop.model.WindowContainer', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.windowcontainer',
    stores: {
        shortcut: {
            fields: [],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'json/shortcut.json',
                reader: {
                    type: 'json',
                    rootProperty: 'shortcut'
                }
            }
        }
    }
});
