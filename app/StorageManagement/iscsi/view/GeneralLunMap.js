Ext.define('DESKTOP.StorageManagement.iscsi.view.GeneralLunMap', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lunmapview',
    requires: [
        'DESKTOP.StorageManagement.iscsi.controller.GeneralLunMapController'
    ],
    controller: 'lunmapsetting',
    itemId: 'generateLunMapView',
    items: [{
        itemId: 'lun_map',
        xtype: 'form',
        bodyPadding: '5 10 10 10',
        fieldDefaults: {
            labelWidth: 100,
            msgTarget: 'qtip'
        },        
        items: [{
            xtype: 'combobox',
            itemId: 'lun_map_target',
            fieldLabel: 'Mapping Target',
            width: 250,
            editable: false,
            queryMode: 'local',
            valueField: 'indx',
            displayField: 'target_name',
            listeners: {
            }
        }]
    }, {
        reference: 'select_lun_map_btn',
        buttons: [{
            itemId: 'btn_cancel',
            text: 'Cancel'
        }, {
            itemId: 'btn_apply',
            text: 'Apply'
        }]
    }]
});
