Ext.define('DESKTOP.Desktop.model.Shortcut', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.shortcut',
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
