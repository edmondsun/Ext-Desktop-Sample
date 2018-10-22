Ext.define('DESKTOP.SystemSetup.network.controller.InterfacesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.netinterfaces',
    requires: [
        'DESKTOP.SystemSetup.network.view.InterfacesSetting',
        'DESKTOP.SystemSetup.network.view.LinkAgg'
    ],
    init: function () {
        this.getViewModel().getStore("netGrid").selVM = this.getViewModel();
        this.globalButton = [{
            defaultName: "Link Aggregation",
            nameIndex: "LINKAGG",
            handler: "onLinkAgg"
        }];
        this.md5sum = 0;
        var me = this;
        var check_status = function () {
            Ext.Ajax.request({
                url: 'app/SystemSetup/backend/network/Interfaces.php',
                method: 'GET',
                params: {
                    md5sum: me.md5sum
                },
                success: function (response) {
                    var res_obj = Ext.JSON.decode(response.responseText);
                    if (res_obj.data.length !== 0) {
                        me.getViewModel().getStore('netGrid').load();
                    }
                    me.md5sum = res_obj.md5sum;
                }
            });
        };
        var task = Ext.TaskManager.start({
            // scope: this,
            run: check_status,
            interval: 10000,
            args: me
        });
    },
    //Button Function
    onEdit: function () {
        var select = Ext.ComponentQuery.query('#nic')[0].getSelectionModel().getSelection()[0];
        var selectData = select.data;
        if (typeof (select) !== "undefined") {
            if (selectData.gateway == "-") {
                selectData.gateway = "";
            }
            var settingWin = Ext.create('DESKTOP.SystemSetup.network.view.InterfacesSetting');
            settingWin.getViewModel().set('selectData',selectData);
            settingWin.show();
        } else {
            Ext.Msg.alert('Error', "Please Select a Interface what you want edit");
        }
    },
    onLinkAgg: function () {
        var linkAggModel = Ext.ComponentQuery.query('#Interface')[0].getViewModel('InterfacesModel').getStore('LinkAgg');
        linkAggModel.removeAll();
        linkAggModel.reload({
            scope: this,
            callback: function (records, operation, success) {
                var storeLinkAgg = new DESKTOP.SystemSetup.network.view.LinkAgg();
                storeLinkAgg.show();
            }
        });
    },
    on_Apply_All: function (form, me) {
        var interfaceobj = Ext.ComponentQuery.query('#Interface')[0];
        var appwindow = me;
        var gw_id = null;
        var gw_addr = "";
        var def_gw_combo = interfaceobj.down("#default_gateway_combo");
        if (def_gw_combo.getValue()) {
            var record = def_gw_combo.getStore().findRecord('name', def_gw_combo.getValue());
            if (record !== null) {
                gw_id = record.get("id");
                gw_addr = record.get("gateway");
            }
        }
        if (form.isValid()) { // make sure the form contains valid data before submitting
            appwindow.showLoadingMask();
            form.submit({
                url: 'app/SystemSetup/backend/network/Interfaces.php',
                params: {
                    op: 'net_setting',
                    gw_id: gw_id,
                    gw_addr: gw_addr
                },
                success: function (form, action) {
                    var ref = 0;
                    appwindow.hideLoadingMask();
                    appwindow.getresponse(ref, 'Interface');
                    interfaceobj.getViewModel('netinterfaces').getStore('netGrid').reload();
                    interfaceobj.getViewModel('netinterfaces').getStore('init').reload();
                },
                failure: function (form, action) {
                    var ref = action.result.msg;
                    appwindow.hideLoadingMask();
                    appwindow.getresponse(ref, 'Interface');
                    interfaceobj.getViewModel('netinterfaces').getStore('netGrid').reload();
                    interfaceobj.getViewModel('netinterfaces').getStore('init').reload();
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Warning', 'Please correct form errors.');
        }
    },
    addGlobalButton: function (windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    }
});
