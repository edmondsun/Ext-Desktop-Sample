/* This library provide tools for RAID.*/
/** raid_type' is a value which display to frontend. 
/** raid_level' is a value which sent to backend. 
*/

/* Create this or require this. Don't use "new ()" */
Ext.define('DESKTOP.StorageManagement.lib.raidTool', {
    constructor: function() {
        // this.callParent(arguments);
    },
    // @Author Stephen
    getRaidTypes: function(diskNum) {
        var type = [];
        if (diskNum >= 1) {
            type.push({
                'raid_type': 'RAID 0',
                'raid_level': 'raid0'
            });
            if (diskNum >= 2) {
                type.push({
                    'raid_type': 'RAID 1',
                    'raid_level': 'raid1'
                });
                if (diskNum >= 3) {
                    type.push({
                        'raid_type': 'RAID 5',
                        'raid_level': 'raid5'
                    });
                    if (diskNum >= 4) {
                        type.push({
                            'raid_type': 'RAID 6',
                            'raid_level': 'raid6'
                        });
                        type.push({
                            'raid_type': 'RAID 10',
                            'raid_level': 'raid10'
                        });
                        if (diskNum >= 6) {
                            type.push({
                                'raid_type': 'RAID 50',
                                'raid_level': 'raid50'
                            });
                            if (diskNum >= 8) {
                                type.push({
                                    'raid_type': 'RAID 60',
                                    'raid_level': 'raid60'
                                });
                            }
                        }
                    }
                }
            }
        }
        return type;
    },
    // End of getRaidTypes
    // @Author Dayo.Choul
    checkRaidSet: function(raidLvl, diskQTY){
        if(raidLvl === null || raidLvl === 'undefined'){
            return false;
        }
        if(diskQTY === 0){
            return null;
        }

        var raidLevel = raidLvl;
        var checkResut = false;
        var raidTypeMinQTYMap = {
            'raid0': 1,
            'raid1': 2,
            'raid5': 3,
            'raid6': 4,
            'raid10': 4,
            'raid50': 6,
            'raid60': 8
        };
        console.debug(raidLevel+ ' needs at least '+ raidTypeMinQTYMap[raidLevel] + ' Disks');
        // console.debug( raidTypeMinQTYMap[raidLevel] );
        if ( diskQTY >= raidTypeMinQTYMap[raidLevel] ){
            checkResut = true;
            console.debug("[PASS] DiskQuantity fits RAID type");
        }
        return checkResut;
    },
    // @Author Dayo.Choul
    calculateEstimatedCapacity: function(raidLvl, PdArray){
        console.debug('Calculating Capacity...');
        console.debug(raidLvl);
        console.debug(PdArray);
        console.debug("Dump selected Slot Size");
        for(var i = 0; i < PdArray.length; i++){
            console.debug('Slot '+PdArray[i].data.slot+' : '+PdArray[i].data.size_gb);
        }


        if(PdArray.length === 0){
            return 0;
        }
        var raidLevel = raidLvl;
        var PdArr = PdArray;
        var sortedPdArr = PdArr.sort(function (a, b) {
            if (a.data.size_gb > b.data.size_gb) {
                return 1;
            }
            if (a.data.size_gb < b.data.size_gb) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        console.debug('Sorted PdArray:');
        console.debug(sortedPdArr);
        var eC = 0;
        var divideIndex = Math.ceil(sortedPdArr.length/2);
        var smallerPdArr = [];
        var largerPdArr = [];

        switch (raidLevel) {
            case 'raid0':
                var sum = Object.keys(sortedPdArr).reduce(function(previous, key) {
                    return previous + sortedPdArr[key].data.size_gb;
                }, 0);
                eC = sum;
                break;
            case 'raid1':
                eC = sortedPdArr[0].data.size_gb;
                break;
            case 'raid5':
                eC = sortedPdArr[0].data.size_gb*2;
                break;
            case 'raid6':
                eC = sortedPdArr[0].data.size_gb*2;
                break;
            case 'raid10':
                // var divideIndex = Math.ceil(sortedPdArr.length/2);
                smallerPdArr = sortedPdArr.splice(0, divideIndex);
                largerPdArr = sortedPdArr;
                eC = smallerPdArr[0].data.size_gb + largerPdArr[0].data.size_gb;
                break;
            case 'raid50':
                // var divideIndex = Math.ceil(sortedPdArr.length/2);
                smallerPdArr = sortedPdArr.splice(0, divideIndex);
                largerPdArr = sortedPdArr;
                eC = (smallerPdArr[0].data.size_gb + largerPdArr[0].data.size_gb)*2;
                break;
            case 'raid60':
                // var divideIndex = Math.ceil(sortedPdArr.length/2);
                smallerPdArr = sortedPdArr.splice(0, divideIndex);
                largerPdArr = sortedPdArr;
                eC = (smallerPdArr[0].data.size_gb + largerPdArr[0].data.size_gb)*2;
                break;
        }
        console.debug("Yooooooooooooo");
        console.debug(eC);
        return eC;
    },
    // @Author Dayo.Choul
    getDedicatedSpareDisks: function(selectedSlots, allSlots){
        console.debug("Get Spare Disks...");
        console.debug(selectedSlots);
        console.debug(allSlots);
        var spareArr = [];
        var sortSlots = function(slotArr){
            if(slotArr instanceof Array){
                var result = slotArr.sort(function (a, b) {
                    if (a.data.size_gb > b.data.size_gb) {
                        return 1;
                    }
                    if (a.data.size_gb < b.data.size_gb) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                });
                return result;
            }else{
                throw new TypeError("Not instance of Array.");
            }
        };
        var S_Slots = sortSlots(selectedSlots);
        var A_Slots = sortSlots(allSlots);
        var minSlot = S_Slots[0];

        function indexSelection(slotArr){
            var index = {};
            for(var i = 0; i < slotArr.length; i++){
                var slot = slotArr[i].data;
                // var id = slot.pd_id;
                index[slot.pd_id] = slot.size_gb; 
            }
            return index;
        }
        function hasSlot(slot, index){
            var id = slot.data.pd_id;
            var size = slot.data.size_gb;
            return index.hasOwnProperty(id) && (size === index[id]);
        }

        console.debug("Indexing......");
        var selIdx = indexSelection(selectedSlots);
        console.debug(selIdx);
        console.debug("Substracting...");
        for(var i = 0; i < A_Slots.length; i++){
            var s = A_Slots[i];
            if(!hasSlot(s, selIdx) && s.data.size_gb >= minSlot.data.size_gb){
                spareArr.push(s);
            }
        }

        return spareArr;
    }
});
