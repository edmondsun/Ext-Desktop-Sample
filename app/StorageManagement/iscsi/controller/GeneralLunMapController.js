Ext.define('DESKTOP.StorageManagement.iscsi.controller.GeneralLunMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lunmapsetting',
    requires: [
    ],
    init: function () {
        var me            = this;
        var mainView      = Ext.ComponentQuery.query('#generateLunMapView')[0];
        var viewSingleBtn = mainView.lookupReference('select_lun_map_btn');
        var it            = {};
        var items         = [];
        var combo         = mainView.down('#lun_map_target');
        var targetHandle  = Ext.data.StoreManager.lookup('targetTree');
        var targetStores  = targetHandle.getData().items;
        
        for (i = 0; i < targetStores.length; i++) {
            it = {
                'target_name': targetStores[i].getData().name,
                'indx': targetStores[i].getData().id
            };
            items.push(it);
        }

        var targetName = Ext.create('Ext.data.Store', {
            fields: ['target_name', 'indx'],
            data: items
        });
        
        combo.bindStore(targetName);
        viewSingleBtn.down('#btn_cancel').on('click', me.onCancel, me);
        viewSingleBtn.down('#btn_apply').on('click', me.onApply, me);

        mainView.down('#lun_map_target').select(0); 
    },
    onCancel: function () {
        Ext.ComponentQuery.query('#lunMapView')[0].close();
    },
    onApply: function () {
        var me        = this;
        var mapWin    = Ext.ComponentQuery.query('#lunMapView')[0];
        var setupView = Ext.ComponentQuery.query('#Setup')[0];
        var selLun    = setupView.down('#grid_unmappedLun').getSelectionModel().getSelection()[0];
        var mainView  = Ext.ComponentQuery.query('#generateLunMapView')[0];
        var selMapTar = mainView.down('#lun_map_target');
        var upmap     = Ext.data.StoreManager.lookup('unmappedLun');
        var tarTree   = Ext.data.StoreManager.lookup('targetTree');
        var mask      = new Ext.LoadMask({
            msg: 'Saving...',
            target: setupView
        });

        mask.show();

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/iscsi/iSCSI.php',
            method: 'post',
            params: {
                op: 'map_iscsi_lun',
                pool: selLun.get('pool_name'),
                lun: selLun.get('lun_name'),
                target_id: selMapTar.value
            },
            success: function (form, action) {
                upmap.load();
                tarTree.load();

                var respText = Ext.util.JSON.decode(form.responseText),
                    msg = respText.msg;
                if (msg !== '') {
                    Ext.MessageBox.alert('<center>Success</center>', msg);
                } else {
                    Ext.MessageBox.alert('<center>Success</center>', "<center>Map target Success</center>");
                }
                me.closeWindow(mapWin);
                mask.destroy();
            },
            failure: function (response, options) {
                upmap.load();
                tarTree.load();
                mask.destroy();
                var respText = Ext.util.JSON.decode(response.responseText);
                var msg = respText.msg;
                Ext.MessageBox.alert('<center>Failed</center>', msg);
            }
        });
    },
    showMask: function (el, str) {
        el.mask(str);
    },
    hideMask: function (el) {
        el.unmask();
    },
    closeWindow: function (el) {
        el.destroy();
    }
});
