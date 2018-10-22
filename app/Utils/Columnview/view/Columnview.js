Ext.define('DESKTOP.Utils.Columnview.view.Columnview', {
    extend: 'Ext.form.Panel',
    alias: 'widget.columnview',
    requires: [
        'DESKTOP.Utils.Columnview.model.ColumnviewModel',
        'DESKTOP.Utils.Columnview.controller.ColumnviewController'
    ],
    controller: 'columnview',
    viewModel: {
        type: 'columnview'
    },
    layout: {
        type: 'hbox'
    },
    itemId: 'columnview',
    // width: '100%',
    // height: '100%',
    scrollable: 'x',
    // overflowX:'scroll',
    config: {
        storeProxy: '',
        defaultPath: ''
    },
    listeners: {
        afterrender: function (view) {
            var me = this;
            var myController = this.getController();
            var store = myController.createStore(view.config.defaultPath);
            var grid = null;
            me.up().on('resize', myController.onColumnviewResize, me);
            store.load({
                callback: function () {
                    myController.createGrid(myController, store);
                }
            });
        },
        resize: 'onColumnviewResize'
    }
});
