Ext.define('DESKTOP.Folder.default.controller.NfsHostController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.foldernfshost',
    init: function () {
        var southObj = this.getView().down('#folderListObj');
        var window = Ext.create('widget.folderlist', {
            viewType: 'NFSHost'
        });
        southObj.add(window);
    },
    onAdd: function () {
        var folderlistSelected = this.getView().down('#folderGrid').getSelectionModel().getSelection()[0];
        var window = Ext.create('widget.window_nfshostsetting', {
            actionType: 'AddNFSHost',
            folderlistSelected: folderlistSelected.data,
            accessStore: this.getStore('accessright')
        });
        window.show();
    },
    onDelete: function () {
        var gridrecord = this.getView().down('#accesgrid').getSelectionModel().getSelection()[0];
        var folderlistSelected = this.getView().down('#folderGrid').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined" && typeof folderlistSelected !== "undefined") {
            var window = Ext.create('widget.window_nfshostsetting', {
                actionType: 'DeleteNFSHost',
                selectedData: gridrecord.data,
                folderlistSelected: folderlistSelected.data
            });
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    },
    onEdit: function () {
        var gridrecord = this.getView().down('#accesgrid').getSelectionModel().getSelection()[0];
        var folderlistSelected = this.getView().down('#folderGrid').getSelectionModel().getSelection()[0];
        if (typeof gridrecord !== "undefined" && typeof folderlistSelected !== "undefined") {
            var window = Ext.create('widget.window_nfshostsetting', {
                actionType: 'EditNFSHost',
                selectedData: gridrecord.data,
                folderlistSelected: folderlistSelected.data
            });
            window.show();
        } else {
            Ext.Msg.alert('Error', "No selected");
        }
    },
    onBeforeNodeExpand: function (node) {
        if (node.isRoot()) return;
        console.log(node);
        var folderTree = this.getStore('folderTree');
        folderTree.setProxy({
            type: 'ajax',
            method: 'get',
            url: 'app/Folder/backend/ShareFolder.php',
            extraParams: {
                op: 'get_folder_list',
                abs_path: node.data.abs_path
            },
            reader: {
                type: 'json',
                successProperty: 'success'
            }
        });
        folderTree.load({
            node: node
        });
    },
    onFolderListSelect: function (record) {
        function getFilesizeGB(input) {
            return filesize(input * 1024 * 1024, {
                output: "array",
                exponent: 3
            })[0];
        }
        var vm = this.getViewModel();
        var accessStore = vm.getStore('accessright');
        var piestore = this.getViewModel().getStore('pie');
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
        accessStore.setProxy({
            type: 'ajax',
            method: 'get',
            url: 'app/Folder/backend/default/Nfs.php',
            extraParams: {
                folder_name: record.data.folder_name
            },
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
        });
        accessStore.load();
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
    reflash: function () {
        var me = this;
        var treeStore = me.getViewModel().getStore('folderTree');
        var treeEl = me.view.down('#folderGrid');
        var select_item = treeEl.getSelectionModel().getSelection()[0];
        me.getViewModel().getStore('folderTree').reload();
        if (typeof select_item !== "undefined") {
            treeStore.on({
                load: {
                    fn: function (store, records, options) {
                        if (typeof (select_item) !== 'undefined') {
                            var index = treeStore.findExact('abs_path', select_item.data.abs_path);
                            treeEl.getSelectionModel().select(index);
                            me.onItemClick(treeEl, select_item);
                        }
                    },
                    scope: treeStore,
                    single: true
                }
            });
        }
    }
    // filter: function (value, property, re) {
    //     var me = this,
    //         tree = this.view.down('#folderGrid'),
    //         matches = [] // array of nodes matching the search criteria
    //         ,
    //         root = tree.getRootNode() // root node of the tree
    //         ,
    //         property = property || 'cifs_name',
    //         value = this.view.down('#searchtext').getValue() // property is optional - will be set to the 'text' propert of the  treeStore record by default
    //         ,
    //         re = re || new RegExp(value, "ig") // the regExp could be modified to allow for case-sensitive, starts  with, etc.
    //         ,
    //         visibleNodes = [] // array of nodes matching the search criteria + each parent non-leaf  node up to root
    //         ,
    //         viewNode;
    //     if (Ext.isEmpty(value)) { // if the search field is empty
    //         me.clearFilter();
    //         return;
    //     }
    //     tree.expandAll(); // expand all nodes for the the following iterative routines
    //     // iterate over all nodes in the tree in order to evalute them against the search criteria
    //     root.cascadeBy(function (node) {
    //         console.log('node.get', node.data['cifs_name'])
    //         if (typeof node.data['cifs_name'] !== "undefined") {
    //             if (node.data['cifs_name'].match(re)) { // if the node matches the search criteria and is a leaf (could be  modified to searh non-leaf nodes)
    //                 matches.push(node); // add the node to the matches array
    //             }
    //         }
    //     });
    //     console.log('matches', matches)
    //     if (me.allowParentFolders === false) { // if me.allowParentFolders is false (default) then remove any  non-leaf nodes from the regex match
    //         Ext.each(matches, function (match) {
    //             if (typeof match !== "undefined") {
    //                 if (!match.getData().leaf) {
    //                     Ext.Array.remove(matches, match);
    //                 }
    //             }
    //         });
    //     }
    //     console.log('matches', matches)
    //     Ext.each(matches, function (item, i, arr) { // loop through all matching leaf nodes
    //         root.cascadeBy(function (node) { // find each parent node containing the node from the matches array
    //             if (node.contains(item) == true) {
    //                 visibleNodes.push(node); // if it's an ancestor of the evaluated node add it to the visibleNodes  array
    //             }
    //         });
    //         if (me.allowParentFolders === true && !item.isLeaf()) { // if me.allowParentFolders is true and the item is  a non-leaf item
    //             item.cascadeBy(function (node) { // iterate over its children and set them as visible
    //                 visibleNodes.push(node);
    //             });
    //         }
    //         visibleNodes.push(item); // also add the evaluated node itself to the visibleNodes array
    //     });
    //     root.cascadeBy(function (node) { // finally loop to hide/show each node
    //         viewNode = Ext.fly(tree.getView().getNode(node)); // get the dom element assocaited with each node
    //         if (viewNode) { // the first one is undefined ? escape it with a conditional
    //             viewNode.setVisibilityMode(Ext.Element.DISPLAY); // set the visibility mode of the dom node to display (vs offsets)
    //             viewNode.setVisible(Ext.Array.contains(visibleNodes, node));
    //         }
    //     });
    //     //tree.updateLayout();
    // }
    // ,
    // clearFilter: function () {
    //     var me = this,
    //         tree = this.getView().down('#folderGrid'),
    //         root = tree.getRootNode();
    //     if (me.collapseOnClear) {
    //         tree.collapseAll(); // collapse the tree nodes
    //     }
    //     root.cascadeBy(function (node) { // final loop to hide/show each node
    //         viewNode = Ext.fly(tree.getView().getNode(node)); // get the dom element assocaited with each node
    //         if (viewNode) { // the first one is undefined ? escape it with a conditional and show  all nodes
    //             viewNode.show();
    //         }
    //     });
    // }
});
