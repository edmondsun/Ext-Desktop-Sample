Ext.define('DESKTOP.StorageManagement.overview.controller.PoolController', {
    extend : 'Ext.app.ViewController',
    requires: [
        'Ext.window.MessageBox'
    ],
    alias : 'controller.overviewpool',
    init: function(){
        var poolVM = this.getViewModel();
        var poolInfo = poolVM.getStore('poolInfo');
        poolInfo.selfVM = poolVM;
        console.info(poolVM);
        poolVM.getStore('encInfoForPool').view = this;
        console.log(this.getViewModel().getStore('encInfoForPool'));
        var encInfoForPool = poolVM.getStore('encInfoForPool');
    	encInfoForPool.selfVM = poolVM;
    },
    set_right_left_button: function (store) {
        var form = store.view;
        var combo = form.down('#com_enc');
        var c_store = combo.getStore();
        var value = combo.getRawValue();
        var index = c_store.findExact('enc_name', value);
        var num = c_store.getCount(index);

        if (index > 0) {
            form.down('#btnLeft').setDisabled(false);
        } else {
            form.down('#btnLeft').setDisabled(true);
        }
        if (num - index <= 1) {
            form.down('#btnRight').setDisabled(true);
        } else {
            form.down('#btnRight').setDisabled(false);
        }

    },
    on_leftBtn_click: function (field) {
        var form = field.up('form');
        var combo = form.down('#com_enc');
        var value = combo.getRawValue();
        var store = combo.getStore();
        var index = store.findExact('enc_name', value);
        var num = store.getCount();

        if (index >= 1) {
            var prerecord = store.getAt(index - 1);
            combo.select(prerecord);
            combo.fireEvent('select', combo, prerecord);
        }
        var a_value = form.down('#com_enc').getRawValue();
        var a_record = store.findRecord('enc_name', a_value);
        var a_index = store.indexOf(a_record);

        if (a_index === 0) {
            field.setDisabled(true);
            field.up('form').down('#btnRight').setDisabled(false);
        } else if (a_index + 1 !== num) {
            field.up('form').down('#btnRight').setDisabled(false);
        } else {
            field.up('form').down('#btnRight').setDisabled(false);
            field.setDisabled(false);
        }
    },
    on_rightBtn_click: function (field) {
        var form = field.up('form');
        var combo = form.down('#com_enc');
        var value = combo.getRawValue();
        var store = combo.getStore();
        var index = store.findExact('enc_name', value);
        var num = store.getCount();

        if (num - index > 1) {
            var nextrecord = store.getAt(index + 1);
            combo.select(nextrecord);
            combo.fireEvent('select', combo, nextrecord);
        }
        var a_value = form.down('#com_enc').getRawValue();
        var a_record = store.findRecord('enc_name', a_value);
        var a_index = store.indexOf(a_record);

        if (a_index + 1 === num) {
            field.setDisabled(true);
            field.up('form').down('#btnLeft').setDisabled(false);
        } else if (a_index > 0) {
            field.up('form').down('#btnLeft').setDisabled(false);
        } else {
            field.up('form').down('#btnLeft').setDisabled(false);
            field.setDisabled(false);
        }
    },
    searchDrawingIndex: function(encRecord){
        var poolInfo = this.getViewModel().getStore('poolInfo');
        var encInfoForPool = this.getViewModel().getStore('encInfoForPool');
        var poolIndex = 0;
        var encDrawingTarget = encRecord.enc_id;
        var encDrawingIndex = [];

        if(poolInfo.selfVM.currentSelectionIndex){
            poolIndex = poolInfo.selfVM.currentSelectionIndex;
        }else{
            poolIndex = poolInfo.selfVM.initIndex;
        }
        var poolRaidSetArray = poolInfo.data.items[poolIndex].data.raidset_arr;
        console.log(poolRaidSetArray);
        for(var i = 0; i < Object.keys(poolRaidSetArray).length; i++){
            console.log(poolRaidSetArray[i].enc_id);
            if( parseInt(poolRaidSetArray[i].enc_id) === parseInt(encDrawingTarget) ){
                console.log("[Yes] Found current pool raidset matches Enc ComboBox");
                // encDrawingIndex = i;
                encDrawingIndex.push(i);
                console.log(encDrawingIndex);
                //break
            }else{
                console.log("[No] Can not find current pool raidset matches Enc ComboBox");
            }
        }
        encInfoForPool.drawingIndex = encDrawingIndex;
        return encDrawingIndex;
    },
    onComboSelect: function (combobox, record) {
        var v = combobox.getValue();
        var rec = combobox.findRecord(combobox.valueField || combobox.displayField, v);
        var index = combobox.store.indexOf(rec);
        console.log("The selected combobox index is: "+ index);
        var comboBoxStore = combobox.getStore();
        comboBoxStore.currentSelectionIndex = index;
        var poolInfo = this.getViewModel().getStore('poolInfo');
        console.log(poolInfo);

        var poolIndex = 0;
        if(poolInfo.selfVM.currentSelectionIndex){
            poolIndex = poolInfo.selfVM.currentSelectionIndex;
        }else{
            poolIndex = poolInfo.selfVM.initIndex;
        }

        var drawingIndex = this.searchDrawingIndex(record.data);
        console.log(drawingIndex);
        this.on_create_boxs(record.data, comboBoxStore, poolInfo.data.items[poolIndex].data, drawingIndex);
    },
    drawEncSlotGraphic: function(record, indexArr){
        var cls = Ext.ComponentQuery.query('[cls=disk_bay_for_pool]');
        Ext.each(cls, function (obj, index) {
            if(obj){
                obj.setStyle({
                  border:'1px solid #fdfdfd',
                  background: 'none',
                  position: 'absolute'
                });
            }
        });
        if(indexArr.length === 0){
            console.log("Can't find pool slot and current enc matches");
            return false;
        }else{
            console.log("Drawing highlight...");
            var form = Ext.ComponentQuery.query('#tabPool')[0];
            console.log(record);
            console.log(indexArr);
            var slots = [];
            for(var i = 0; i < indexArr.length; i++){
                var raidSetSlotData = record.raidset_arr[i].slot.split(" ");
                for(var j = 0; j < raidSetSlotData.length; j++){
                    slots.push(raidSetSlotData[j]);
                }
            }

            console.log(slots);

            Ext.each(slots, function (obj, index) {
                var slot = "#" + 'disk_bay_for_pool' + parseInt(obj-1);
                var slotCmp = form.down(slot);
                if(slotCmp){
                    slotCmp.setStyle({
                        border: '1px solid #32c1c7',
                        backgroundColor: '#32c1c7',
                        position: 'absolute'
                    });
                    console.log('form.down.slot',form.down(slot));
                }
            });
        }

    },
    on_create_boxs: function (record, encInfo_store, poolRecord, poolRaidIndex) {
        console.log("Drawing white border on slot...");
        var cls = Ext.ComponentQuery.query('[cls=disk_bay_for_pool]');
        var form = Ext.ComponentQuery.query('#tabPool')[0];
        var enc_col = record.col;
        var enc_row = record.row;
        var enc_seq = record.sequence.split(" ");

        Ext.each(cls, function () {
            this.destroy();
        });
        var boxs = [];
        var c = form.down('#drawing');

        Ext.Array.each(enc_seq, function (name, index, countriesItSelf) {
            var v = Ext.create('Ext.Component', {
                cls: 'disk_bay_for_pool',
                itemId: 'disk_bay_for_pool' + (name - 1),
                border: true,
                x: 20 + parseInt((name - 1) / enc_row) * 79,
                y: 57 + ((name - 1) % enc_row) * 21,
                width: 78,
                height: 20,
                style: "overflow:hidden;border:1px solid #fdfdfd;border-radius: 2px"
                // listeners: {
                //     afterrender: function (obj) {
                //         //console.log('index,enc_col,enc_row',index,enc_col*enc_row);
                //     }
                // }
            });
            boxs.push(v);
        });

        c.add(boxs);
        c.updateLayout({defer:true});
        //var poolInfo = this.getViewModel().getStore('poolInfo');
        //console.log(poolRaidIndex);

        //if(poolRaidIndex !== null){

        var encInfoForPool = this.getViewModel().getStore('encInfoForPool');
        console.log(encInfoForPool.drawingIndex);    
        this.drawEncSlotGraphic(poolRecord, encInfoForPool.drawingIndex);
    },
    selectPoolRow: function(node, record, index, eOpts) {
        // TODO[2]: Most of code in this function should be moved to model, because I repeat myself
        // TODO[1]: Handle Pool Status Locked and Failed
        var selectedItem = node.selected.items[0];
        var selectedData = selectedItem.data;
        var poolVM = this.getViewModel();
        var poolComposition = Ext.StoreManager.lookup('pool_composition');
        var poolPie = Ext.StoreManager.lookup('pool_pie');
        var poolInfo = poolVM.getStore('poolInfo');

        //console.log(selectedItem);
        //console.log(selectedData);
        console.log("You select no." + index + " row");
        poolVM.set('currentPoolValue', selectedData.pool_guid);
        poolVM.currentSelectionIndex = poolInfo.find( poolVM.get('currentPoolKey') , poolVM.get('currentPoolValue'));

        poolComposition.loadChildren(selectedData, false, poolVM.currentSelectionIndex);
        
        var iSCSIUsedGB = {
            item: 'iSCSI',
            capacity: (selectedData.used_by_lun_mb / 1024).toFixed(2)
        };
        var foldersUsedGB = {
            item: 'Folders',
            capacity: (selectedData.used_by_vol_mb / 1024).toFixed(2)
        };
        var availableGB = {
            item: 'Available',
            capacity: ((selectedData.total_mb - selectedData.used_by_lun_mb - selectedData.used_by_vol_mb) / 1024).toFixed(2)
        };
        var pieData = [];
        pieData.push(iSCSIUsedGB);
        pieData.push(foldersUsedGB);
        pieData.push(availableGB);
        poolPie.loadData(pieData);

        poolVM.set('currentPoolName', selectedData.pool_name );
        poolVM.set('foldersUsedGB', foldersUsedGB.capacity );
        poolVM.set('iSCSIUsedGB', iSCSIUsedGB.capacity  );
        poolVM.set('availableGB', availableGB.capacity );
        poolVM.set('totalGB',  (selectedData.total_mb / 1024).toFixed(2) );

        var encInfoForPool = this.getViewModel().getStore('encInfoForPool');
        var encIndex = 0;
        if(encInfoForPool.currentSelectionIndex){
            encIndex = encInfoForPool.currentSelectionIndex;
        }else{
            encIndex = encInfoForPool.initIndex;
        }
        var drawingIndex = this.searchDrawingIndex(encInfoForPool.data.items[encIndex].data);
        console.log(drawingIndex);
        this.on_create_boxs(encInfoForPool.data.items[encIndex].data, encInfoForPool, record.data, drawingIndex);
    }
});
