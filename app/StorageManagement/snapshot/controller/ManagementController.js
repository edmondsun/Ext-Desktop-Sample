Ext.define('DESKTOP.StorageManagement.snapshot.controller.ManagementController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.snapshotmanagement',
    init: function () {
        var snapshotInfo = this.getViewModel().getStore('snapshotInfo');
        snapshotInfo.selfController = this;
    },
    onComboSelect: function (combo, record) {
        var snapshotInfo = this.getViewModel().getStore('snapshotInfo');
        snapshotInfo.queryType(combo, record);
    },
    onSearch: function () {
        var me = this;
        var searchtext = this.getView().down('#searchtext').getValue();
        var store = me.getStore('snapshotInfo');
        var queryStr = null;
        if (searchtext.match(/\w+/) === null && searchtext !== "") {
            queryStr = new RegExp("(\\" + searchtext + ")", "gi");
        } else {
            queryStr = new RegExp("(" + searchtext + ")", "gi");
        }
        store.clearFilter(true);
        store.filter({
            filterFn: function (record) {
                var name = record.get('zfs_name');
                var match = name.match(queryStr);
                return match;
            }
        });
    },
    onGridselect: function (grid, record) {
        var piestore = this.getViewModel().getStore('pie');
        var snapshotlist = this.getViewModel().getStore('snapshotlist');
        var FreeGB = {
            name: 'Free',
            size: record.data.avail_gb
        };
        var UsedGB = {
            name: 'Used',
            size: record.data.used_by_dataset_gb
        };
        var SnapshotGB = {
            name: 'Snapshot',
            size: record.data.used_by_snapshot_gb
        };
        var pieData = [];
        pieData.push(FreeGB);
        pieData.push(UsedGB);
        pieData.push(SnapshotGB);
        piestore.loadData(pieData);
        // this.getView().down('polar').bindStore(piestore);
        snapshotlist.loadData(record.data.snap_list);
        var tmp_obj = {
            'Name': record.data.zfs_name,
            'FreeGB': record.data.avail_gb,
            'UsedGB': record.data.used_by_dataset_gb,
            'SnapshotGB': record.data.used_by_snapshot_gb,
            'SnapshotTypeDefault': record.data.sched_desc
        };
        for (var index in tmp_obj) {
            this.getViewModel().set(index, tmp_obj[index]);
        }
    },
    onTake: function () {
        var gridrecord = this.getView().down('#snapshotgrid').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined") {
            var window = Ext.create('widget.window_snapshotsetting', {
                windowSize: 'small',
                actionType: 'TakeSnapshot',
                selectedData: gridrecord
            });
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    },
    onAddSchedule: function () {
        var gridrecord = this.getView().down('#snapshotgrid').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined") {
            var window = Ext.create('widget.window_snapshotsetting', {
                windowSize: 'medium',
                actionType: 'SnapshotSchedule',
                selectedData: gridrecord.get('name')
            });
            if (gridrecord.data.sched_type === "weekly") {
                window.down('#weekDays').setValue({
                    'week_day[]': gridrecord.data.sched_weekday
                });
            }
            var winVM = window.getViewModel();
            for (var index in gridrecord.data) {
                winVM.set(index, gridrecord.data[index]);
            }
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    },
    doClone: function () {
        var gridrecord = this.getView().down('#snapshotlist').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined") {
            var window = Ext.create('widget.window_snapshotsetting', {
                windowSize: 'small',
                actionType: 'SnapshotClone',
                selectedData: gridrecord
            });
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    },
    doRollBack: function () {
        var gridrecord = this.getView().down('#snapshotlist').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined") {
            var window = Ext.create('widget.window_snapshotsetting', {
                windowSize: 'small',
                actionType: 'RollBack',
                selectedData: gridrecord
            });
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    },
    onDelete: function () {
        var gridrecord = this.getView().down('#snapshotlist').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined") {
            console.log('321');
            var window = Ext.create('widget.window_snapshotsetting', {
                windowSize: 'small',
                actionType: 'DeleteSnapshot',
                selectedData: gridrecord
            });
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    }
});
