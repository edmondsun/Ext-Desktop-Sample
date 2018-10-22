Ext.define('DESKTOP.Folder.default.controller.WindowsNetworkHostController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.folderwindowsnetworkhost',
    requires: ['DESKTOP.lib.isIpIn'],
    init: function () {
        var southObj = this.getView().down('#folderListObj');
        var window = Ext.create('widget.folderlist', {
            viewType: 'WindowsNetworkHost'
        });
        southObj.add(window);
    },
    onAdd: function () {
        var vm = this.getViewModel();
        var share_name = vm.get('share_name');
        var rpath = vm.get('rpath');
        if (rpath !== '') {
            var window = Ext.create('widget.window_windowsnetworkhost', {
                actionType: 'AddWindowsNetworkHost',
                share_name: share_name,
                rpath: rpath,
                store: 'hostIP',
                caller: 'WindowsNetworkHost'
            });
            window.show();
        } else {
            Ext.Msg.alert('No selection', 'No selected item, please try again.');
        }
    },
    onDelete: function (me) {
        var vm = this.getViewModel();
        var share_name = vm.get('share_name');
        var rpath = vm.get('rpath');
        var host = vm.get('host');

        var window = Ext.create('widget.window_windowsnetworkhost', {
            actionType: 'DeleteWindowsNetworkHost',
            share_name: share_name,
            rpath: rpath,
            selectedData: host,
            store: 'hostIP',
            caller: 'WindowsNetworkHost'
        });
        window.show();
    },
    onFolderListSelect: function (record) {
        function getFilesizeGB(input) {
            return filesize(input * 1024 * 1024, {
                output: "array",
                exponent: 3
            })[0];
        }
        var vm = this.getViewModel();
        var piestore = vm.getStore('pie');
        var hostIP = vm.getStore('hostIP');
        var btn_add = Ext.ComponentQuery.query('#btn_add')[0];
        var free = parseInt(record.data.avail_space.substring(0, record.data.avail_space.length - 1));
        var used = parseInt(record.data.used_space.substring(0, record.data.used_space.length - 1));
        var total = parseInt(record.data.total_space.substring(0, record.data.total_space.length - 1));
        var FreeGB = {
            name: 'Free',
            // size: record.data.avail_space
            size: getFilesizeGB(free)
        };
        var UsedGB = {
            name: 'Used',
            // size: record.data.used_space
            size: getFilesizeGB(used)
        };
        // console.log(free);
        // console.log(filesize(free*1024*1024, {output: "array", exponent: 3}))
        var SnapshotGB = {
            name: 'Snapshot',
            size: 1
        };
        var pieData = [];
        pieData.push(FreeGB);
        pieData.push(UsedGB);
        pieData.push(SnapshotGB);
        piestore.loadData(pieData);
        btn_add.setDisabled(false);

        vm.set('share_name', record.data.folder_name);
        vm.set('rpath', record.data.abs_path);
        hostIP.setProxy({
            type: 'ajax',
            method: 'get',
            url: 'app/Folder/backend/default/WindowsHost.php',
            extraParams: {
                op: 'get_network_host',
                share_path: record.data.abs_path
                // share_name: record.data.folder_name,
            },
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
        });
        hostIP.reload();

        vm.set('folder_name', record.data.folder_name);
        vm.set('folders_num', record.data.subfolder_num);
        vm.set('files_num', record.data.file_num);
        vm.set('volume', record.data.volume);
        vm.set('pool', record.data.pool);
        vm.set('total_size', getFilesizeGB(total));
        vm.set('used', UsedGB.size);
        vm.set('free', FreeGB.size);
        vm.set('snapshot_size', SnapshotGB.size);
    },
    onHostSelect: function (grid, record) {
        var vm = this.getViewModel();
        vm.set('host', record.get('host'));
    },
    onRefresh: function () {
        var folderStore = Ext.StoreManager.lookup('folderTree');
        folderStore.reload();
    },
    onSearch: function (field) {
        var form = field.up('#WindowsNetworkHost');
        var store_folder = form.getViewModel().getStore('folderTree');
        var filter = field.getValue();
        store_folder.clearFilter();

        store_folder.filterBy(function (val) {
            var share_name = val.get('folder_name');
            return (share_name.search(filter) !== -1);
        });
    }
});
