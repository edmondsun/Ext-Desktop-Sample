Ext.define('DESKTOP.Folder.default.model.CreateShareFolderModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.createshare',
    formulas: {
        currentVol: {
            bind: {
                bindTo: '{volumeCombo.selection}',
                deep  : true
            },
            get: function(record) {
                console.log("formula get record");
                console.log(record);
                return record;
            }
        }
    },
    stores: {
        compressionOptions: {
            autoLoad: false,
            fields: ['value', 'str'],
            data: [
            {
                'value': 'normal',
                'str': 'Normal'
            }, {
                'value': 'zero',
                'str': 'Zero reclaim'
            }, {
                'value': 'generic',
                'str': 'Generic zero reclaim'
            }]
        },
        volumeAll: {
            storeId: 'volumeAll',
            autoLoad: true,
            fields: [
                'vol_name',
                'pool_name',
                {
                    name: 'vol_pool',
                    type: 'string',
                    calculate: function(data) {
                        return data.vol_name + ' \\ ' + data.pool_name;
                    }
                }
            ],
            proxy: {
                type: 'ajax',
                method: 'get',
                url: 'app/Folder/backend/default/ShareFolder.php',
                extraParams: {
                    op: 'get_all_volumes'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: function(store, records, successful) {
                    console.log("model is rendered");
                    console.log(records[0]);
                    console.log(this);
                    this.fireEvent('volumeLoadComplete', {'firstRecord': records[0]});
                    // var CreateShareFolder = Ext.ComponentQuery.query('#createshare');
                    
                    // if (CreateShareFolder[0].lookupReference('titleLable').text == 'Create Folder') {
                    //     console.log('in');
                    //     var volumeCombo = CreateShareFolder[0].lookupReference('volumeCombo');
                    //     volumeCombo.select(records[0]);
                    // }
                }
            }
        }
    }

});
