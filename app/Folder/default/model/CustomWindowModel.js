Ext.define('DESKTOP.Folder.default.model.CustomWindowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.customwindow',
    stores: {
        customPerms: {
            storeId: 'customWindowSettings',
            autoLoad: false,
            originalPerms: null,
            fields: [
                'list_type',
                'flag',
                'mask',
                'inherited',
                'no_propagate',
                {
                    name: 'perm',
                    calculate: function(data) {
                        var set  = 1,
                            perm = [];

                        for (var idx = 2; idx <= 14; idx++) {
                            if (data.mask & set)
                                perm.push(idx);
                            set <<= 1;
                        }
                        console.log("calculated");
                        console.log(perm);
                        return perm;
                    }
                }, {
                    name: 'deletion',
                    type: 'boolean',
                    defaultValue: false
                }
            ],
        /*
            isDirty: function() {
                var currentPerms  = this.getData().items,
                    originalPerms = this.originalPerms;

                console.log("in is dirty");
                console.log(currentPerms);
                console.log(originalPerms);
                for (var index in currentPerms) {
                    // check if new schema is set
                    if (typeof originalPerms[index] == 'undefined') {
                        // console.log("perm in dirty is");
                        // console.log(currentPerms[index].data.mask);
                        if (currentPerms[index].data.mask !== 0 && !currentPerms[index].data.deletion)
                            return true;
                    } else {
                        // console.log("perm in else");
                        // check if any item is modified
                        for (var item in originalPerms[index]) {
                             // console.log(item);
                             // console.log(currentPerms[index].data[item]);
                             // console.log(originalPerms[index][item]);
                            if (currentPerms[index].data[item] !== originalPerms[index][item])
                                return true;
                        }
                    }
                }

                return false;
            },
            getChangedData: function() {
                var currentPerms  = this.getData().items,
                    originalPerms = this.originalPerms,
                    ret = [];

                for (var index in currentPerms)
                {
                    var newPermPack, oldPermPack, permPack, isModified = false;
                    // check if new schema is set
                    if (typeof originalPerms[index] == 'undefined') {

                        if (currentPerms[index].data.mask == 0 || currentPerms[index].data.deletion)
                            continue;

                        oldPermPack = 0;
                        newPermPack = {
                            'list_type': currentPerms[index].data.list_type,
                            'flag'     : currentPerms[index].data.flag,
                            'mask'     : currentPerms[index].data.mask,
                            'inherited': currentPerms[index].data.inherited,
                            'no_propagate': currentPerms[index].data.no_propagate
                        };
                    } else {
                        // check if is modified
                        for (var item in originalPerms[index]) {
                            if (currentPerms[index].data[item] !== originalPerms[index][item]
                                || currentPerms[index].data.deletion)
                            {
                                isModified = true;
                                break;
                            }
                        }

                        if (!isModified)    continue;

                        newPermPack = {
                            'list_type': currentPerms[index].data.list_type,
                            'flag'     : currentPerms[index].data.flag,
                            'mask'     : currentPerms[index].data.mask,
                            'inherited': currentPerms[index].data.inherited,
                            'no_propagate': currentPerms[index].data.no_propagate
                        };

                        oldPermPack = {
                            'list_type': originalPerms[index].list_type,
                            'flag'     : originalPerms[index].flag,
                            'mask'     : originalPerms[index].mask,
                            'inherited': originalPerms[index].inherited,
                            'no_propagate': originalPerms[index].no_propagate
                        };

                        if (currentPerms[index].data.deletion || currentPerms[index].data.mask === 0)
                            newPermPack = 0;
                    }

                    permPack = {
                        'old': oldPermPack,
                        'new': newPermPack
                    };

                    ret.push(permPack);
                }

                return ret;
            },
        */
            getUpdatingData: function() {
                var currentPerms  = this.getData().items,
                    ret = [];

                for (var index in currentPerms) {
                    if (currentPerms[index].data.deletion || currentPerms[index].data.mask === 0)
                        continue;

                    ret.push({
                        'list_type'   : currentPerms[index].data.list_type,
                        'flag'        : currentPerms[index].data.flag,
                        'mask'        : currentPerms[index].data.mask,
                        'inherited'   : currentPerms[index].data.inherited,
                        'no_propagate': currentPerms[index].data.no_propagate
                    });
                }

                if (ret.length === 0)
                    ret = 0;

                return ret;
            }
        }
    }
});
