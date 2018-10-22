Ext.define('DESKTOP.StorageManagement.pool.controller.PoolController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.window.MessageBox',
        'Ext.util.Base64',
        'Ext.JSON',
        'DESKTOP.StorageManagement.pool.view.EditPool',
        'DESKTOP.StorageManagement.pool.view.Unlock',
        'DESKTOP.StorageManagement.pool.view.CreatePool',
        'DESKTOP.StorageManagement.pool.view.ExpandPool',
        'DESKTOP.StorageManagement.pool.view.ScrubPool'
    ],
    alias: 'controller.pool',
    raidToolLib: null,
    scrubBool: false,
    init: function() {
        // Because creating pool might spend more thatn default 30 secs
        Ext.Ajax.setTimeout(300000);
        this.globalButton = [{
            defaultName: "Create",
            nameIndex: "Create",
            handler: "onCreatePool"
        }];
        this.raidToolLib = new DESKTOP.StorageManagement.lib.raidTool();
    },

    addGlobalButton: function(windowEl, panelEl) {
        windowEl.getController().addItemtoToolbarGlobalButton(windowEl, panelEl, this.globalButton);
    },

    afterview: function() {
        var poolVM = this.getViewModel();
        var poolInfo = poolVM.getStore('poolInfo');
        poolInfo.selfVM = poolVM;
        console.info(poolVM);
    },

    /*Pop Window event*/
    onCreatePool: function() {
        // var vm = this.getViewModel();
        // console.log(vm);
        var create_pool = Ext.create('DESKTOP.StorageManagement.pool.view.CreatePool');
        create_pool.show();
    },
    /* Handle Enclosue unit switching  */
    onCreatePoolEnCBSelect: function(combo) {
        // var $win = Ext.ComponentQuery.query('#CreatePool')[0];
        // var $spare_tg = $win.down('#spare_disk_tg').setValue(null); // store.removeAll() will be fine
        var vm = this.getViewModel();
        var enclosure_create = vm.getStore('enclosure_create');
        var enclosure_grid = vm.getStore('enclosure_grid');
        var spareDiskStore = vm.getStore('spare_disk');
        var RAIDtype = vm.getStore('RAID_type');
        RAIDtype.removeAll();
        spareDiskStore.removeAll();
        console.log("Enc Value: ", combo.value);
        enclosure_create.lastEncID = combo.value;
        /* Reload Enclosure Grid Data */
        enclosure_grid.loadSlotData(combo.value);
        // Initialize
        vm.set('total_cap', 0);
        vm.set('disk_count', 0);
        vm.set('user_raid_type', null);
        //console.log('CB', vm.get('disk_count'))
        Ext.ComponentQuery.query('#raidtypecb')[0].setValue(null);
        Ext.ComponentQuery.query('#createPoolConfirm')[0].setDisabled(false);
    },
    /* Get Raid Type Options and Calculate Estimated Capacity */
    onCreatePoolGridSelect: function(column, recordIndex, checked) {
        var vm = this.getViewModel();
        var enclosure_grid = vm.getStore('enclosure_grid');
        var spareDiskStore = vm.getStore('spare_disk');
        spareDiskStore.removeAll();
        // Check which view
        // if(typeof Ext.ComponentQuery.query('#CreatePool')[0]!=='undefined'){ //Create Pool
        //     var $win = Ext.ComponentQuery.query('#CreatePool')[0];
        //     var $spare_tg = $win.down('#spare_disk_tg');
        //     // var sel_spare_disk = $win.down('#sel_spare_disk');
        //     $spare_tg.setValue(null);
        //     // sel_spare_disk.setValue('');
        // }else{ //Expand Pool
        //     // var $win = Ext.ComponentQuery.query('#ExpandPool')[0];
        //     // var $spare_tg = $win.down('#spare_disk_tg');
        //     // var sel_spare_disk = $win.down('#sel_spare_disk');
        //     // $spare_tg.setValue(null);
        //     // sel_spare_disk.setValue('');
        // }
        // var rec_size = enclosure_grid.getAt(recordIndex).get('size_gb');

        if (this.raidToolLib === null || this.raidToolLib === 'undefined') {
            this.raidToolLib = new DESKTOP.StorageManagement.lib.raidTool();
        }
        // Initialize Selected Slot Array
        vm.selectedSlotArray = [];
        enclosure_grid.each(function(record) {
            if (record.get('seletion') === true) {
                vm.selectedSlotArray.push(record);
            }
        });
        console.log(vm.selectedSlotArray);
        if (vm.selectedSlotArray.length === 0) {
            vm.set('disk_count', 0);
            vm.set('user_raid_type', null);
            vm.set('user_raid_level', null);
            Ext.ComponentQuery.query('#raidtypecb')[0].setValue(null);
            vm.set('total_cap', 0);
            return false;
        }
        // var current_size = vm.get('total_cap');
        var current_disk = vm.get('disk_count');
        var raidSetCheck = null;

        if (checked) {
            raidSetCheck = true;
            vm.set('disk_count', current_disk + 1);
        } else {
            vm.set('disk_count', current_disk - 1);
        }

        // Load Available RAID set Options by Disk quatity
        var type = this.raidToolLib.getRaidTypes(vm.get('disk_count'));
        console.info('grid', vm.get('disk_count'));
        vm.getStore('RAID_type').loadData(type);

        console.log(type);

        if (type.length <= 0) {
            // Disk Count is 0
            vm.set('user_raid_type', null);
            vm.set('user_raid_level', null);
        }

        if (vm.get('user_raid_type') !== null) {
            console.log("Current RAID Type:");
            console.log(vm.get('user_raid_type'));
        } else { //&& type.length > 0!!
            // type is null, initialize to RAID 0
            console.log("---------------------------");
            console.log("Reset to RAID 0");
            vm.set('user_raid_type', type[0].raid_type);
            vm.set('user_raid_level', type[0].raid_level);
        }

        console.log("Type:", type);

        if (raidSetCheck === null) {
            raidSetCheck = this.raidToolLib.checkRaidSet(vm.get('user_raid_level'), vm.get('disk_count'));
        }

        if (raidSetCheck === false) {
            console.log("[RESET to RAID 0] Disk QTY is insufficient");
            vm.set('user_raid_type', type[0].raid_type);
            vm.set('user_raid_level', type[0].raid_level);
        }

        // Set Raid Type ComboBox
        var index = vm.getStore('RAID_type').find('raid_type', vm.get('user_raid_type'));
        // var RAIDLevel = vm.get('user_raid_level');
        console.log("Type Index: " + index);
        console.log("Set RAID type ComboBox Value:");
        console.log(vm.get('user_raid_type'));
        console.log(vm.get('user_raid_level'));
        console.log(vm.getStore('RAID_type').getAt(index));
        Ext.ComponentQuery.query('#raidtypecb')[0].setValue(vm.getStore('RAID_type').getAt(index));

        // Calculate Estimated Capacity
        var eCapacity = this.raidToolLib.calculateEstimatedCapacity(vm.get('user_raid_level'), vm.selectedSlotArray);
        console.log("Estimated Capacity: ", eCapacity);
        vm.set('total_cap', eCapacity);


        if (vm.get('user_raid_level') !== 'raid0') {
            var spareData = [];
            var spareDiskCandidates = this.raidToolLib.getDedicatedSpareDisks(vm.selectedSlotArray, enclosure_grid.getRange(0, enclosure_grid.getCount()));
            console.log("Spare Disk Candidates:");
            console.log(spareDiskCandidates);
            spareDiskCandidates.map(function(obj) {
                spareData.push(obj.data);
            });
            console.log(spareData);
            spareDiskStore.loadData(spareData);
        }
    },

    onCreatePoolRaidCBSelect: function(record) {
        var vm = this.getViewModel();
        var enclosure_grid = vm.getStore('enclosure_grid');
        var spareDiskStore = vm.getStore('spare_disk');
        spareDiskStore.removeAll();
        // if(typeof Ext.ComponentQuery.query('#CreatePool')[0] !== 'undefined'){
        //     var $win = Ext.ComponentQuery.query('#CreatePool')[0];
        //     var $spare_tg = $win.down('#spare_disk_tg');
        //     // var sel_spare_disk = $win.down('#sel_spare_disk');
        //     $spare_tg.setValue(null);
        //     // sel_spare_disk.setValue('');
        // }else{
        //     // var $win = Ext.ComponentQuery.query('#ExpandPool')[0];
        //     // var $spare_tg = $win.down('#spare_disk_tg');
        //     // var sel_spare_disk = $win.down('#sel_spare_disk');
        //     // $spare_tg.setValue(null);
        //     // sel_spare_disk.setValue('');
        // }
        vm.set('user_raid_type', record.displayTplData[0].raid_type);
        vm.set('user_raid_level', record.displayTplData[0].raid_level);
        console.log(vm.get('user_raid_type'));
        if (this.raidToolLib === null || this.raidToolLib === 'undefined') {
            this.raidToolLib = new DESKTOP.StorageManagement.lib.raidTool();
        }
        // Calculate Estimated Capacity
        var eCapacity = this.raidToolLib.calculateEstimatedCapacity(record.displayTplData[0].raid_level, vm.selectedSlotArray);
        console.log("Estimated Capacity: ", eCapacity);
        vm.set('total_cap', eCapacity);
        // var RAIDLevel = vm.get('user_raid_level');
        if (vm.get('user_raid_level') !== 'raid0') {
            var spareData = [];
            var spareDiskCandidates = this.raidToolLib.getDedicatedSpareDisks(vm.selectedSlotArray, enclosure_grid.getRange(0, enclosure_grid.getCount()));
            console.log("Spare Disk Candidates:");
            console.log(spareDiskCandidates);
            spareDiskCandidates.map(function(obj) {
                spareData.push(obj.data);
            });
            console.log(spareData);
            spareDiskStore.loadData(spareData);
        }


    },

    onCreatePoolConfirm: function() {
        var $win = Ext.ComponentQuery.query('#CreatePool')[0];
        var form = $win.down('form').getForm();
        var vm = this.getViewModel();
        // var enclosure_grid = vm.getStore('enclosure_grid');
        // var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');

        if (form.isValid()) { // make sure the form contains valid data before submitting
            var name = form.findField('name').getSubmitValue();
            //
            var raid_pd_id = [];
            var password = form.findField('password').getSubmitValue();
            password = Ext.util.Base64.encode(password);

            var unlock = form.findField('auto_unlock').getSubmitValue();
            var pd_prop_write_cache = form.findField('write_cache').getSubmitValue();
            var raid_level = form.findField('raid_level').getSubmitValue();
            var enable_encrypt = form.findField('enable_encrypt').getSubmitValue();
            var encrypt_type = '';
            var spare_pd_id = form.findField('spare_disk_tg').getSubmitValue();
            if (enable_encrypt === true && unlock === true) {
                encrypt_type = "auto_unlock";
            } else if (enable_encrypt === true) {
                encrypt_type = "enable";
            } else {
                encrypt_type = "disable";
            }

            for (var i = 0; i < vm.selectedSlotArray.length; i++) {
                raid_pd_id.push(vm.selectedSlotArray[i].data.pd_id);
            }
            raid_pd_id = Ext.JSON.encode(raid_pd_id);
            spare_pd_id = Ext.JSON.encode(spare_pd_id);

            console.log('----------------------');
            console.log('name: ', name);
            console.log('raid_pd_id: ', raid_pd_id);
            console.log('spare_pd_id: ', spare_pd_id);
            console.log('encrypt_passwd_x: ', password);
            console.log('encrypt_type: ', encrypt_type);
            console.log('pd_prop_write_cache: ', pd_prop_write_cache);
            console.log('raid_level: ', raid_level);
            console.log('----------------------');
            // var mask = new Ext.LoadMask({
            //     msg: "Creating",
            //     target: $win
            // });
            // mask.show();
            $win.mask('Creating');
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/pool/Pool.php',
                method: 'post',
                params: {
                    op: 'pool_create',
                    name: name,
                    raid_pd_id: raid_pd_id,
                    spare_pd_id: spare_pd_id,
                    encrypt_passwd_x: password,
                    encrypt_type: encrypt_type,
                    pd_prop_write_cache: pd_prop_write_cache,
                    raid_level: raid_level
                },
                success: function(response) {
                    $win.unmask();
                    // mask.destroy();
                    console.log("Create Success");
                    console.log(response.responseText);
                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                    var result = (Ext.JSON.decode(response.responseText)).success;
                    if (result === true) {
                        if (msg === '' || msg === null) {
                            msg = 'Success';
                        }
                        var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                        poolInfoStore.reload();
                        $win.close();
                        Ext.Msg.alert('Successfully create pool ' + name, msg);
                    } else {
                        if (msg === '' || msg === null) {
                            msg = 'Failed';
                        }
                        Ext.Msg.alert('Failed', msg);
                    }
                },
                failure: function(response) {
                    $win.unmask();
                    // mask.destroy();
                    console.log("Create Failed");
                    console.log(response.responseText);
                    Ext.Msg.alert('Failed', response.responseText);
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    onExpandPool: function() {
        // var vm = this.getViewModel();
        var $win = Ext.ComponentQuery.query('#Pool')[0].down('#poolInfo');
        var selectpool = $win.getSelectionModel().getSelection()[0];
        if (typeof(selectpool) !== "undefined") {
            var expand_pool = Ext.create('DESKTOP.StorageManagement.pool.view.ExpandPool');
            var pool_name = selectpool.get('pool_name');
            var raidset_arr = selectpool.get('raidset_arr');
            var total_gb = selectpool.get('total_gb');
            // var used_gb = selectpool.get('used_gb');
            // var used_capacity = parseInt(selectpool.get('capacity'), 10);
            // var avil_capacity = 100 - used_capacity;
            // var capacity_percent = used_capacity * 0.01;

            // console.log('???', capacity_percent);
            expand_pool.down('#pool_name').setValue(pool_name);
            expand_pool.down('#total_size').setValue(total_gb + 'GB');
            expand_pool.show();
            /* Only after show event is triggered that you could get the right VM and Store*/
            // Load RAID set tree 
            var poolComposition = Ext.data.StoreManager.lookup('pool_composition_for_expand');
            var compositionArray = [];
            var prefixText = 'Raid type: ';
            for (var i = 0; i < Object.keys(raidset_arr).length; i++) {
                var raidSet = raidset_arr[i];
                var raidTypeInfo = prefixText + raidSet.raid_level + ' (' + raidSet.enc_name + ': ' + raidSet.slot + ')';
                var rsObj = {
                    text: raidTypeInfo,
                    leaf: true,
                    iconCls: 'pool-raid-leaf'
                };
                compositionArray.push(rsObj);
            }
            console.log(compositionArray);

            var root = {
                expanded: true,
                children: compositionArray
            };
            poolComposition.loadData(root.children);
            // Load Pie Chart 
            var poolPie = Ext.data.StoreManager.lookup('pie_for_expand');

            var foldersUsedGB = {
                item: 'Folders',
                capacity: (selectpool.get('used_by_vol_mb') / 1024).toFixed(2)
            };

            var iSCSIUsedGB = {
                item: 'iSCSI',
                capacity: (selectpool.get('used_by_lun_mb') / 1024).toFixed(2)
            };

            var availableGB = {
                item: 'Available',
                capacity: ((selectpool.get('total_mb') - selectpool.get('used_by_lun_mb') - selectpool.get('used_by_vol_mb')) / 1024).toFixed(2)
            };
            var pieData = [];
            pieData.push(iSCSIUsedGB);
            pieData.push(foldersUsedGB);
            pieData.push(availableGB);
            poolPie.loadData(pieData);

            expand_pool.down('#foldersUsedGB').setValue(foldersUsedGB.capacity + 'GB');
            expand_pool.down('#iSCSIUsedGB').setValue(iSCSIUsedGB.capacity + 'GB');
            expand_pool.down('#availableGB').setValue(availableGB.capacity + 'GB');
        } else {
            Ext.Msg.alert('Oops', "Please Select a Pool what you want expand");
        }
    },
    onExpandPoolConfirm: function() {
        var $win = Ext.ComponentQuery.query('#ExpandPool')[0];
        var form = $win.down('form').getForm();
        var vm = this.getViewModel();
        // var enclosure_grid = vm.getStore('enclosure_grid');
        var grid = Ext.ComponentQuery.query('#Pool')[0].down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];

        if (form.isValid()) {
            var name = selectpool.get('pool_name');
            var raid_pd_id = [];
            var raid_level = form.findField('raid_level').getSubmitValue();

            for (var i = 0; i < vm.selectedSlotArray.length; i++) {
                raid_pd_id.push(vm.selectedSlotArray[i].data.pd_id);
            }
            raid_pd_id = Ext.JSON.encode(raid_pd_id);

            console.log('----------------------');
            console.log('name', name);
            console.log('raid_pd_id', raid_pd_id);
            console.log('raid_level', raid_level);
            console.log('----------------------');
            // var mask = new Ext.LoadMask({
            //     msg: "Creating",
            //     target: $win
            // });
            // mask.show();
            $win.mask('Expanding');
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/pool/Pool.php',
                params: {
                    op: 'pool_expand',
                    name: name,
                    raid_pd_id: raid_pd_id,
                    raid_level: raid_level
                },
                // waitMsg: 'Expanding',
                success: function(response) {
                    $win.unmask();
                    // mask.destroy();
                    console.log("Expand Success");
                    console.log(response);
                    console.log(response.responseText);
                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                    var result = (Ext.JSON.decode(response.responseText)).success;
                    if (result === true) {
                        if (msg === '' || msg === null) {
                            msg = 'Success';
                        }
                        Ext.Msg.alert('Successfully expand pool ' + name, msg);
                        var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                        poolInfoStore.reload();
                        $win.close();
                    } else {
                        if (msg === '' || msg === null) {
                            msg = 'Failed';
                        }
                        Ext.Msg.alert('Failed', msg);
                    }
                },
                failure: function(response) {
                    $win.unmask();
                    console.log("Expand Failed");
                    console.log(response.responseText);
                    Ext.Msg.alert('Failed', response.responseText);
                }
            });
        } else {
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    onEditPool: function() {
        // var vm = this.getViewModel();
        var grid = Ext.ComponentQuery.query('#Pool')[0].down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        console.log(selectpool);

        // var spareDiskStore = vm.getStore('spare_disk');
        // spareDiskStore.removeAll();

        if (typeof(selectpool) !== "undefined") {
            var edit_pool = Ext.create('DESKTOP.StorageManagement.pool.view.EditPool');
            var pool_name = selectpool.get('pool_name');
            var encrypt_type = selectpool.get('encrypt_type');
            var $viewpoolname = edit_pool.down('#pool_name');
            var cache = $viewpoolname.next('#cache');
            var enablencrypt = edit_pool.down('#enablencrypt');
            var disablencrypt = enablencrypt.next('#disablencrypt');
            $viewpoolname.setText(pool_name);
            if (encrypt_type === "disable") {
                edit_pool.down('#enablecb').setValue(false);
                enablencrypt.disable();
                enablencrypt.hide();
            } else {
                edit_pool.down('#enablecb').setValue(true);
                enablencrypt.enable();
                enablencrypt.show();
                disablencrypt.disable();
                disablencrypt.hide();
                if (encrypt_type === "auto_unlock") {
                    edit_pool.down("#radio_en_y").setValue(true);
                } else {
                    edit_pool.down("#radio_en_n").setValue(true);
                }
            }
            if (selectpool.get('pd_prop_write_cache') === true) {
                cache.setValue(true);
            } else {
                cache.setValue(false);
            }
            edit_pool.show();
        } else {
            Ext.Msg.alert('Oops', "Please Select a Pool what you want edit");
        }
    },
    onEditPoolConfirm: function() {
        var $win = Ext.ComponentQuery.query('#editpool')[0];
        var form = $win.down('form').getForm();
        var grid = Ext.ComponentQuery.query('#Pool')[0].down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        var pool_name = selectpool.get('pool_name');
        var pool_guid = selectpool.get('pool_guid');

        if (form.isValid()) { // make sure the form contains valid data before submitting
            var enable_encrypt = form.findField('enable_encrypt').getSubmitValue();
            var encrypt_type;
            var pd_prop_write_cache = form.findField('pd_prop_write_cache').getSubmitValue();
            var unlock = (form.findField('auto_unlock_en').getSubmitValue() === null) ? form.findField('auto_unlock_dis').getSubmitValue() : form.findField('auto_unlock_en').getSubmitValue();
            var password = (form.findField('password_en').getSubmitValue() === '') ? form.findField('password_dis').getSubmitValue() : form.findField('password_en').getSubmitValue();
            password = Ext.util.Base64.encode(password);
            // console.log("en", form.findField('auto_unlock_en').getSubmitValue());
            // console.log("dis", form.findField('auto_unlock_dis').getSubmitValue());
            if (enable_encrypt === true && unlock === true) {
                encrypt_type = "auto_unlock";
            } else if (enable_encrypt === true) {
                encrypt_type = "enable";
            } else {
                encrypt_type = "disable";
                password = '';
            }
            console.log('--------Edit--------');
            console.log('name', pool_name);
            console.log('encrypt_type', encrypt_type);
            console.log('pool_guid', pool_guid);
            console.log('encrypt_passwd_x', password);
            console.log('pd_prop_write_cache', pd_prop_write_cache);
            console.log('---------------------');

            // var mask = new Ext.LoadMask({
            //     msg: "Saving",
            //     target: $win
            // });
            // mask.show();
            $win.mask("Saving");
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/pool/Pool.php',
                method: 'post',
                params: {
                    op: 'pool_set_prop',
                    encrypt_type: encrypt_type,
                    name: pool_name,
                    pool_guid: pool_guid,
                    encrypt_passwd_x: password,
                    pd_prop_write_cache: pd_prop_write_cache
                },

                success: function(response) {
                    $win.unmask();
                    // mask.destroy();
                    console.log("Edit Pool Success");
                    console.log(response.responseText);
                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                    var result = (Ext.JSON.decode(response.responseText)).success;
                    if (result === true) {
                        if (msg === '' || msg === null) {
                            msg = 'Success';
                        }
                        Ext.Msg.alert('Success', msg);
                        var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                        poolInfoStore.reload();
                        $win.close();
                    } else {
                        if (msg === '' || msg === null) {
                            msg = 'Failed';
                        }
                        Ext.Msg.alert('Failed', msg);
                    }
                },
                failure: function(response) {
                    $win.unmask();
                    // mask.destroy();
                    console.log("Edit Pool Failed");
                    console.log(response.responseText);
                    Ext.Msg.alert('Failed', "Failed to edit pool property");
                }
            });
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    onUnlock: function() {
        var grid = Ext.ComponentQuery.query('#Pool')[0].down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        if (typeof(selectpool) !== "undefined") {
            var unlock = Ext.create('DESKTOP.StorageManagement.pool.view.Unlock');
            var pool_name = selectpool.get('pool_name');
            var viewpoolname = unlock.down('#pool_name');
            viewpoolname.setText(pool_name);
            unlock.show();
        } else {
            Ext.Msg.alert('Oops', "Please Select a Pool what you want unlock");
        }
    },
    onUnlockConfirm: function() {
        var $win = Ext.ComponentQuery.query('#unlock')[0];
        var form = $win.down('form').getForm();
        var grid = Ext.ComponentQuery.query('#Pool')[0].down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        var encrypt_type = selectpool.get('encrypt_type');
        var pool_name = selectpool.get('pool_name');
        var pool_guid = selectpool.get('pool_guid');
        if (form.isValid()) { // make sure the form contains valid data before submitting
            var key_file = form.findField('key_file').getSubmitValue();
            // var password = (form.findField('password_en').getSubmitValue() === null) ? form.findField('password_dis').getSubmitValue() : form.findField('password_en').getSubmitValue();
            var password = form.findField('password').getSubmitValue();
            password = Ext.util.Base64.encode(password);

            console.log('--------Unlock--------');
            console.log('name', pool_name);
            console.log('encrypt_type', encrypt_type);
            console.log('pool_guid', pool_guid);
            console.log('encrypt_passwd_x', password);
            console.log('---------------------');

            $win.mask("Unlocking");
            // Ext.Ajax.request({
            //     url: 'app/StorageManagement/backend/pool/Pool.php',
            //     method: 'post',
            //     params: {
            //         op: 'pool_unlock',
            //         name: pool_name,
            //         pool_guid: pool_guid,
            //         encrypt_passwd_x: password,
            //         key_file: key_file
            //     },
            //     // waitMsg: 'Saving',
            //     success: function(response) {
            //         $win.unmask();
            //         var msg = (Ext.JSON.decode(response.responseText)).msg;
            //         var result = (Ext.JSON.decode(response.responseText)).success;
            //         if(result === true){
            //             if(msg === '' || msg === null){
            //                 msg = 'Success';
            //             }
            //             Ext.Msg.alert('Successfully unlock pool '+ name, msg);
            //             var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
            //             poolInfoStore.reload();
            //             $win.close();
            //         }else{
            //             if(msg === '' || msg === null){
            //                 msg = 'Failed';
            //             }
            //             Ext.Msg.alert('Failed', msg);
            //         }
            //     },
            //     failure: function(response) {
            //         $win.unmask();
            //         console.log(response.responseText);
            //         Ext.Msg.alert('Failed', "Failed to unlock pool: " + pool_name);
            //     }
            // });

            form.submit({
                url: 'app/StorageManagement/backend/pool/Pool.php',
                type: 'POST',
                params: {
                    op: 'pool_unlock',
                    name: pool_name,
                    pool_guid: pool_guid,
                    encrypt_passwd_x: password,
                    key_file: key_file
                },
                success: function(form, action) {
                    Ext.Msg.alert('Successfully unlock pool ' + name);
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
            $win.unmask();
        } else { // display error alert if the data is invalid
            Ext.Msg.alert('Invalid Data', 'Please correct form errors.');
        }
    },
    onDelete: function() {
        var $win = Ext.ComponentQuery.query('#Pool')[0];
        var grid = $win.down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        var pool_name = selectpool.get('pool_name');
        if (typeof(selectpool) !== "undefined") {
            Ext.Msg.confirm("waring", "Are you sure that you want to delete pool: " + pool_name, function(btn) {
                if (btn == 'yes') {
                    console.log("Delete pool: ", pool_name);
                    var mask = new Ext.LoadMask({
                        msg: "Deleting",
                        target: $win
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: 'app/StorageManagement/backend/pool/Pool.php',
                        method: 'post',
                        params: {
                            op: 'pool_delete',
                            name: pool_name
                        },
                        waitMsg: 'Delete',
                        success: function(response) {
                            mask.destroy();
                            var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                            poolInfoStore.reload();
                            var msg = (Ext.JSON.decode(response.responseText)).msg;
                            var result = (Ext.JSON.decode(response.responseText)).success;
                            if (result === true) {
                                Ext.Msg.alert('Success', msg);
                            } else {
                                Ext.Msg.alert('Failed', msg);
                            }
                        },
                        failure: function(response) {
                            mask.destroy();
                            var msg = (Ext.JSON.decode(response.responseText)).msg;
                            console.log('Failed', msg);
                            Ext.Msg.alert('Failed', 'Failed to delete ' + pool_name);
                        }
                    });
                }
            });
        } else {
            Ext.Msg.alert('Notice', "Please Select a Pool");
        }
    },
    onScrubPool: function() {
        var $win = Ext.ComponentQuery.query('#Pool')[0],
            grid = $win.down('#poolInfo'),
            selectpool = grid.getSelectionModel().getSelection()[0];

        var $scrub = Ext.create('DESKTOP.StorageManagement.pool.view.ScrubPool'),
            startTbar = $scrub.down('#startScrubToolbar'),
            stopTbar = $scrub.down('#stopScrubToolbar'),
            scrubMsg = $scrub.down('#pool_scrub_msg'),
            scrubStatus = $scrub.down('#pool_scrub_status'),
            closeScrub = $scrub.down('#closeScrubBtn'),
            stopScrub = $scrub.down('#stopScrubBtn');

        if (typeof selectpool !== "undefined") {
            var status = selectpool.get('status');
            var name = selectpool.get('pool_name');
            if (status.toLowerCase() === 'scrubbing') {
                var progress = selectpool.get('progress');
                scrubStatus.setValue(Math.floor(progress) + '%');
                startTbar.setHidden(true);
                stopTbar.setHidden(false);
                scrubMsg.setHidden(true);
                scrubStatus.setHidden(false);
                closeScrub.setHidden(true);
                stopScrub.setHidden(false);
                $scrub.show();
            } else {
                scrubMsg.setValue(name);
                startTbar.setHidden(false);
                stopTbar.setHidden(true);
                scrubMsg.setHidden(false);
                scrubStatus.setHidden(true);
                $scrub.show();
            }
        }
    },
    onScrubPoolConfirm: function(me, e, eOpts) {
        me.setDisabled(true);
        var $win = Ext.ComponentQuery.query('#Pool')[0],
            grid = $win.down('#poolInfo'),
            selectpool = grid.getSelectionModel().getSelection()[0];
        var pool_name = selectpool.get('pool_name');
        var $scrub = Ext.ComponentQuery.query('#scrubpool')[0],
            startTbar = $scrub.down('#startScrubToolbar'),
            stopTbar = $scrub.down('#stopScrubToolbar'),
            scrubMsg = $scrub.down('#pool_scrub_msg'),
            scrubStatus = $scrub.down('#pool_scrub_status'),
            closeScrub = $scrub.down('#closeScrubBtn'),
            stopScrub = $scrub.down('#stopScrubBtn'),
            cancelScrub = $scrub.down('#cancelScrubBtn');

        cancelScrub.setDisabled(true);
        // TODO: Mask
        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/pool/Pool.php',
            method: 'post',
            params: {
                op: 'pool_start_scrub',
                pool_name: pool_name
            },
            success: function(response) {
                me.setDisabled(false);
                cancelScrub.setDisabled(false);
                var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                poolInfoStore.reload();
                var msg = (Ext.JSON.decode(response.responseText)).msg;
                var result = (Ext.JSON.decode(response.responseText)).success;
                if (result === true) {
                    startTbar.setHidden(true);
                    stopTbar.setHidden(false);
                    scrubMsg.setHidden(true);
                    scrubStatus.setHidden(false);
                    closeScrub.setHidden(true);
                    stopScrub.setHidden(false);
                    var progress = selectpool.get('progress');
                    scrubStatus.setValue(Math.floor(progress) + '%');
                    Ext.Msg.alert('Success', "Start scrubbing pool: " + pool_name);
                } else {
                    Ext.Msg.alert('Failed', msg);
                }
            },
            failure: function(response) {
                me.setDisabled(false);
                cancelScrub.setDisabled(false);
                var msg = (Ext.JSON.decode(response.responseText)).msg;
                Ext.Msg.alert('Failed', msg);
            }
        });
    },
    onScrubPoolStop: function(me, e, eOpts) {
        me.setDisabled(true);
        var $win = Ext.ComponentQuery.query('#Pool')[0],
            grid = $win.down('#poolInfo'),
            selectpool = grid.getSelectionModel().getSelection()[0];
        var pool_name = selectpool.get('pool_name'),
            scrubProgress = selectpool.get('progress');
        var $scrub = Ext.ComponentQuery.query('#scrubpool')[0],
            startTbar = $scrub.down('#startScrubToolbar'),
            stopTbar = $scrub.down('#stopScrubToolbar'),
            scrubMsg = $scrub.down('#pool_scrub_msg'),
            scrubStatus = $scrub.down('#pool_scrub_status');

        Ext.Ajax.request({
            url: 'app/StorageManagement/backend/pool/Pool.php',
            method: 'post',
            params: {
                op: 'pool_stop_scrub',
                pool_name: pool_name
            },
            success: function(response) {
                me.setDisabled(false);
                this.scrubBool = false;
                var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                poolInfoStore.reload();
                var msg = (Ext.JSON.decode(response.responseText)).msg;
                var result = (Ext.JSON.decode(response.responseText)).success;
                if (result === true) {
                    Ext.Msg.alert('Success', "Stop scrubbing pool: " + pool_name);
                    startTbar.setHidden(false);
                    stopTbar.setHidden(true);
                    scrubMsg.setHidden(false);
                    scrubStatus.setHidden(true);
                } else {
                    Ext.Msg.alert('Failed', msg);
                }
            },
            failure: function(response) {
                me.setDisabled(false);
                var msg = (Ext.JSON.decode(response.responseText)).msg;
                Ext.Msg.alert('Failed', msg);
            }
        });
    },
    // onScrub: function() {
    //     var $win = Ext.ComponentQuery.query('#Pool')[0];
    //     var grid = $win.down('#poolInfo');
    //     var selectpool = grid.getSelectionModel().getSelection()[0];
    //     var status = selectpool.get('status');

    //     if (typeof(selectpool) !== "undefined") {
    //         if (status.toLowerCase() === 'scrubbing') {
    //             Ext.Msg.confirm("Notice", "Are you going to STOP scrubbing this pool?", function(btn) {
    //                 if (btn == 'yes') {
    //                     var pool_name = selectpool.get('pool_name');
    //                     console.log("Scrub pool: ", pool_name);
    //                     var mask = new Ext.LoadMask({
    //                         msg: "Loading",
    //                         target: $win
    //                     });
    //                     mask.show();
    //                     Ext.Ajax.request({
    //                         url: 'app/StorageManagement/backend/pool/Pool.php',
    //                         method: 'post',
    //                         params: {
    //                             op: 'pool_stop_scrub',
    //                             pool_name: pool_name
    //                         },
    //                         success: function(response) {
    //                             mask.destroy();
    //                             var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
    //                             poolInfoStore.reload();
    //                             var msg = (Ext.JSON.decode(response.responseText)).msg;
    //                             var result = (Ext.JSON.decode(response.responseText)).success;
    //                             if (result === true) {
    //                                 Ext.Msg.alert('Success', "Stop scrubbing pool: " + pool_name);
    //                             } else {
    //                                 Ext.Msg.alert('Failed', msg);
    //                             }
    //                         },
    //                         failure: function(response) {
    //                             mask.destroy();
    //                             var msg = (Ext.JSON.decode(response.responseText)).msg;
    //                             Ext.Msg.alert('Failed', msg);
    //                         }
    //                     });
    //                 }
    //             });
    //             return false;
    //         } else {
    //             Ext.Msg.confirm("Notice", "Are you going to scrub this pool?", function(btn) {
    //                 if (btn == 'yes') {
    //                     var pool_name = selectpool.get('pool_name');
    //                     console.log("Scrub pool: ", pool_name);
    //                     var mask = new Ext.LoadMask({
    //                         msg: "Loading",
    //                         target: $win
    //                     });
    //                     mask.show();
    //                     Ext.Ajax.request({
    //                         url: 'app/StorageManagement/backend/pool/Pool.php',
    //                         method: 'post',
    //                         params: {
    //                             op: 'pool_start_scrub',
    //                             pool_name: pool_name
    //                         },
    //                         success: function(response) {
    //                             mask.destroy();
    //                             var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
    //                             poolInfoStore.reload();
    //                             var msg = (Ext.JSON.decode(response.responseText)).msg;
    //                             var result = (Ext.JSON.decode(response.responseText)).success;
    //                             if (result === true) {
    //                                 Ext.Msg.alert('Success', "Start scrubbing pool: " + pool_name);
    //                             } else {
    //                                 Ext.Msg.alert('Failed', msg);
    //                             }
    //                         },
    //                         failure: function(response) {
    //                             mask.destroy();
    //                             var msg = (Ext.JSON.decode(response.responseText)).msg;
    //                             Ext.Msg.alert('Failed', msg);
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     } else {
    //         Ext.Msg.alert('Notice', "Please Select a Pool");
    //     }
    // },
    onPort: function(me, e, eOpts) {
        var $win = Ext.ComponentQuery.query('#Pool')[0];
        var grid = $win.down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        var pool_guid = selectpool.get('pool_guid');
        var mask = new Ext.LoadMask({
            msg: "Loading",
            target: $win
        });
        if (me.exportBool && typeof selectpool !== 'undefined') {
            // Export
            mask.show();
            var form = Ext.create('Ext.form.Panel', { // this wolud be your form
                standardSubmit: true // this is the important part
            });
            form.submit({
                url: 'app/StorageManagement/backend/pool/Pool.php',
                type: 'POST',
                params: {
                    op: 'pool_export_encrypt_key',
                    pool_guid: pool_guid
                },
                success: function(form, action) {},
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
            mask.destroy();
        } else {
            // Import
        }
    },
    /*End of Pop Window event*/
    selectPoolRow: function(node, record, index, eOpts) {
        // TODO[2]: Most of code in this function should be moved to model, because I repeat myself
        // TODO[1]: Handle Pool Status Locked and Failed
        var selectedItem = node.selected.items[0];
        var selectedData = selectedItem.data;
        var poolVM = this.getViewModel();
        var poolComposition = poolVM.getStore('pool_composition');
        var poolInfo = poolVM.getStore('poolInfo');
        var poolPie = poolVM.getStore('pie');
        var status = selectedData.status,
            encryptionType = selectedData.encrypt_type;

        if (status === null) {
            return false;
        }
        if (status.toLowerCase() === 'scrubbing') {
            var $scrub = Ext.ComponentQuery.query('#scrubpool')[0];
            if (typeof $scrub !== 'undefined') {
                this.scrubBool = true;
                var scrubStatus = $scrub.down('#pool_scrub_status');
                var progress = selectedData.progress;
                scrubStatus.setValue(Math.floor(progress) + '%');
            }
        }else{
            console.info("Scrubbing?", this.scrubBool);
            var $scrub = Ext.ComponentQuery.query('#scrubpool')[0];
            if(typeof $scrub !== 'undefined' && selectedData.progress === 0){
                // Scrubbing DONE, set status to 100
                var progress = 100;
                var scrubStatus = $scrub.down('#pool_scrub_status'),
                    closeScrub = $scrub.down('#closeScrubBtn'),
                    stopScrub = $scrub.down('#stopScrubBtn');
                scrubStatus.setValue(progress + '%');
                this.scrubBool = false;
                closeScrub.setHidden(false);
                stopScrub.setHidden(true);
            }
        }
        console.log(selectedItem);
        console.log(selectedData);
        console.log("You select no." + index + " row");

        poolVM.set('currentPoolValue', selectedData.pool_guid);
        poolVM.currentSelectionIndex = poolInfo.find(poolVM.get('currentPoolKey'), poolVM.get('currentPoolValue'));

        console.info(poolVM.get('currentPoolKey'));
        console.info(poolVM.get('currentPoolValue'));

        poolComposition.loadChildren(selectedData, false, index);

        var pieData = [];
        var foldersUsedGB = {
            item: 'Folders',
            capacity: (selectedData.used_by_vol_mb / 1024).toFixed(2)
        };
        var iSCSIUsedGB = {
            item: 'iSCSI',
            capacity: (selectedData.used_by_lun_mb / 1024).toFixed(2)
        };
        var availableGB = {
            item: 'Available',
            capacity: ((selectedData.total_mb - selectedData.used_by_lun_mb - selectedData.used_by_vol_mb) / 1024).toFixed(2)
        };
        poolVM.set('foldersUsedGB', foldersUsedGB.capacity);
        poolVM.set('iSCSIUsedGB', iSCSIUsedGB.capacity);
        poolVM.set('availableGB', availableGB.capacity);
        poolVM.set('vm_pool_name', selectedData.pool_name);
        poolVM.set('vm_pool_size', selectedData.total_gb);
        poolVM.set('vm_pool_used_percent', selectedData.used_percent);
        poolVM.set('vm_pool_avl_percent', parseInt((100 - selectedData.used_percent), 10));
        poolVM.set('vm_pool_used_bar', (selectedData.used_percent / 100).toFixed(2));
        console.log("When polling, isDirty? ", poolVM.isDirty);

        if (poolVM.isDirty === false) {
            poolVM.set('vm_pool_threshold', [selectedData.usage_info_level, selectedData.usage_warn_level]);
            poolVM.set('vm_pool_usage_alert', selectedData.usage_alert);
        }

        var $win = Ext.ComponentQuery.query('#Pool')[0],
            notification = $win.down('#notification'),
            capacityNotification = $win.down('#capacity_notification_thumb'),
            poolUnlock = $win.down('#pool_unlock'),
            poolPorting = $win.down('#pool_porting');

        // Check if status is locked
        if (status.toLowerCase() === 'locked') {
            foldersUsedGB.capacity = 0;
            iSCSIUsedGB.capacity = 0;
            availableGB.capacity = 100;
            poolVM.set('foldersUsedGB', '-');
            poolVM.set('iSCSIUsedGB', '-');
            poolVM.set('availableGB', '-');
            poolVM.set('vm_pool_size', '-');
            poolUnlock.setDisabled(false);
            poolPorting.setDisabled(true);
            // poolPorting.setText(poolPorting.importValue);
            poolPorting.exportBool = false;
            notification.setDisabled(true);
            capacityNotification.setDisabled(true);
        } else {
            poolUnlock.setDisabled(true);
            poolPorting.setText(poolPorting.exportValue);
            poolPorting.exportBool = true;
            if (encryptionType.toLowerCase() === 'disable') {
                poolPorting.setDisabled(true);
            } else {
                // auto_unlock or enable
                poolPorting.setDisabled(false);
            }

            notification.setDisabled(false);
            capacityNotification.setDisabled(false);
        }

        // Initialize multislider
        if (notification.getValue() === false) {
            capacityNotification.setDisabled(true);
        } else {
            capacityNotification.setDisabled(false);
        }

        pieData.push(foldersUsedGB);
        pieData.push(iSCSIUsedGB);
        pieData.push(availableGB);
        poolPie.loadData(pieData);
    },
    onDrag: function(slider) {
        this.setDirty();
    },
    setDirty: function() {
        var poolVM = this.getViewModel();
        poolVM.isDirty = true;
        console.log("Set Dirty: ", poolVM.isDirty);
    },
    toogleNotification: function(toogle, newValue, oldValue, eOpt) {
        this.setDirty();
        var $win = Ext.ComponentQuery.query('#Pool')[0];
        var capacityNotification = $win.down('#capacity_notification_thumb');
        if (newValue === false) {
            capacityNotification.setDisabled(true);
        } else {
            capacityNotification.setDisabled(false);
        }
    },
    unSetDirty: function() {
        var poolVM = this.getViewModel();
        poolVM.isDirty = false;
        console.log("Set Dirty: ", poolVM.isDirty);

    },
    dirtycheck: function() {
        var poolVM = this.getViewModel();
        var $win = Ext.ComponentQuery.query('#Pool')[0];
        var grid = $win.down('#poolInfo');
        // Check if pool list is empty
        if (grid.getSelectionModel().getCount() === 0) {
            return false;
        }
        var selectpool = grid.getSelectionModel().getSelection()[0];

        var notification = selectpool.get('usage_alert');
        var modifiedNotification = $win.down('#notification').getValue();
        var infoLevel = selectpool.get('usage_info_level');
        var warnLevel = selectpool.get('usage_warn_level');
        var threshold = [infoLevel, warnLevel].join();
        // Ext JS 5.1.2 use getValues()
        var modifiedThreshold = $win.down('#capacity_notification_thumb').getValues().join();
        console.log("Original notification", notification);
        console.log("Modified notification", modifiedNotification);
        console.log("Original threshold", threshold);
        console.log("Modified threshold", modifiedThreshold);

        if ((notification === modifiedNotification) && (threshold === modifiedThreshold)) {
            console.log("Nothing changed");
            return false;
        }
        if (poolVM.isDirty === true) {
            return true;
        } else { //null or false
            return false;
        }
    },
    on_Apply_All: function(form, me) {
        var appwindow = me;
        var poolVM = this.getViewModel();
        var $win = Ext.ComponentQuery.query('#Pool')[0];
        var grid = $win.down('#poolInfo');
        var selectpool = grid.getSelectionModel().getSelection()[0];
        if (typeof(selectpool) !== "undefined") {
            // Ext.Msg.confirm("Notice", "Are you going to scrub this pool?", function(btn) {
            // if (btn == 'yes') {
            var pool_name = selectpool.get('pool_name');
            var enable = $win.down('#notification').getValue();
            var notifyThreshold = $win.down('#capacity_notification_thumb');
            // console.log(notifyThreshold.getValues());
            var info_level = notifyThreshold.getValue(0);
            var warn_level = notifyThreshold.getValue(1);
            enable = (enable === true) ? 1 : 0;

            console.log('--------Apply All--------');
            console.log('name', pool_name);
            console.log('notification enable', enable);
            console.log('info_level', info_level);
            console.log('warn_level', warn_level);
            console.log('--------Apply All--------');

            // var mask = new Ext.LoadMask({
            //     msg: "Applying",
            //     target: $win
            // });
            appwindow.showLoadingMask();
            Ext.Ajax.request({
                url: 'app/StorageManagement/backend/pool/Pool.php',
                method: 'post',
                params: {
                    op: 'pool_set_usage_notice',
                    pool_name: pool_name,
                    info_level: info_level,
                    warn_level: warn_level,
                    enable: enable
                },

                success: function(response) {
                    appwindow.hideLoadingMask();
                    var ref = 0;
                    appwindow.getresponse(ref, 'Pool');
                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                    var result = (Ext.JSON.decode(response.responseText)).success;
                    if (result === true) {
                        Ext.Msg.alert('Success', "Apply config successfully.");
                        poolVM.isDirty = false;
                        // var poolInfoStore = Ext.data.StoreManager.lookup('pool_info');
                        // poolInfoStore.reload();
                    } else {
                        Ext.Msg.alert('Failed', "Failed to apply config.");
                    }
                },
                failure: function(response) {
                    appwindow.hideLoadingMask();
                    var msg = (Ext.JSON.decode(response.responseText)).msg;
                    var ref = msg;
                    appwindow.getresponse(ref, 'Pool');
                    Ext.Msg.alert('Failed', msg);
                }
            });
        } else {
            Ext.Msg.alert('Notice', "Failed to apply config.");
        }
    }
});
