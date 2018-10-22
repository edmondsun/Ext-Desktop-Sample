Ext.define('DESKTOP.SystemSetup.notification.model.MailModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mail',
    stores: {
        emailinfo: {
            fields: [
                'provider', 'default_smtp_server', 'default_auth_method', 'default_port'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/data/email_provider.json',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var record = records[0];
                        var form = Ext.ComponentQuery.query('#Mail')[0];
                        form.getForm().loadRecord(record);
                    }
                }
            }
        },
        getmail: {
            fields: [
                'mail_type', 'mail_from', 'smtp_server', 'auth_method', 'account', 'password'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/notification/Mail.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["mail_from"]',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var record = records[0];
                        var form = Ext.ComponentQuery.query('#Mail')[0];
                        form.getForm().loadRecord(record);
                    }
                }
            }
        },
        mailtoaddr: {
            storeId: 'mailtoaddr',
            fields: [
                'mail_to', 'info', 'warning', 'error', 'backup_event'
            ],
            // autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/notification/Mail.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["mail_to"]',
                    successProperty: 'success'
                }
            },
            listeners: {
                load: {
                    fn: function (store, records, success) {
                        var record = records[0];
                        var form = Ext.ComponentQuery.query('#Mail')[0];
                        form.getForm().loadRecord(record);
                        var recordcount = store.getCount();
                        var count = '';
                        store.each(function (record, idx) {
                            val = record.get('mail_to');
                            if (val !== '') {
                                count++;
                            }
                        });
                        if (count == recordcount)
                            Ext.ComponentQuery.query('#Mail')[0].down('#addmail').disable();
                        Ext.data.StoreManager.lookup('initMailRecord').load();
                    }
                }
            }
        },
        initMailRecord: {
            storeId: 'initMailRecord',
            fields: [
                'mail_to', 'info', 'warning', 'error', 'backup_event'
            ],
            proxy: {
                type: 'ajax',
                url: 'app/SystemSetup/backend/notification/Mail.php',
                method: 'get',
                reader: {
                    type: 'json',
                    rootProperty: 'data["mail_to"]',
                    successProperty: 'success'
                }
            }
        }
    }
});
