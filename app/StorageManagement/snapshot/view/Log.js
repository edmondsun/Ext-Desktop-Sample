Ext.define('DESKTOP.StorageManagement.snapshot.view.Log', {
    extend: 'Ext.form.Panel',
    alias: 'widget.snapshotlog',
    itemId: 'Log',
    requires: [
        'DESKTOP.StorageManagement.snapshot.controller.LogController',
        'DESKTOP.StorageManagement.snapshot.model.LogModel'
    ],
    controller: 'snapshotlog',
    viewModel: {
        type: 'snapshotlog'
    },
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true
});
