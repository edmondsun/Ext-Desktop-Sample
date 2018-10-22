Ext.define('DESKTOP.Service.rsync.view.Rsync', {
    extend: 'Ext.form.Panel',
    alias: 'widget.rsync',
    requires: [
        'DESKTOP.Service.rsync.controller.RsyncController',
        'DESKTOP.Service.rsync.model.RsyncModel'
    ],
    controller: 'rsync',
    viewModel: {
        type: 'rsync'
    },
    itemId: 'Rsync',
    title: "Rsync",
    frame: true,
    collapsible: true,
    autoScroll: true,
    waitMsgTarget: true,
    trackResetOnLoad: true,
    bodyPadding: 20,
    fieldDefaults: {
        labelWidth: 180,
        msgTarget: 'side'
    },
    items: [{
        xtype: 'form',
        items: [{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
            	reference: 'RSYNC_SETTING_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Enable Rsync service',
                itemId: 'rsync_setting_enable',
                name: 'rsync_setting_enable',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false,
				bind: {
                	value: '{rsync_data.rsync_setting_enable}'
            	},
            	listeners: {
            		change: 'onRsynSetEnable'
            	}
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'numberfield',
                itemId: 'rsync_port',
                name: 'rsync_port',
                fieldLabel: 'Port number',
                allowBlank: false,
                msgTarget: 'qtip',                 
                maskRe: /^[0-9]*/,
                regex: /^[0-9]*/,
                regexText: 'Invalid number',
                minValue: 1,
                maxValue: 65535,
                listeners: {
                    blur: function(el) {
                        var me = this;

                        if (me.getValue() === null) {
                            return;
                        }

                        if (me.getValue().toString().indexOf('.') != -1) {
                            el.reset();
                        }
                    }
                },
				bind: {
                	value: '{rsync_data.rsync_port}',
                	disabled: '{!RSYNC_SETTING_ENABLE.checked}'
            	}
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'numberfield',
                itemId: 'rsync_uplod_rate',
                name: 'rsync_uplod_rate',
                fieldLabel: 'Maximum upload rate (MB/s)',
                allowBlank: false,
                msgTarget: 'qtip', 
                maskRe: /^[0-9]*/,
                regex: /^[0-9]*/,
                regexText: 'Invalid number',
                listeners: {
                    blur: function(el) {
                        var me = this;

                        if (me.getValue() === null) {
                            return;
                        }

                        if (me.getValue().toString().indexOf('.') != -1) {
                            el.reset();
                        }
                    }
                },
				bind: {
                	value: '{rsync_data.rsync_uplod_rate}',
                	disabled: '{!RSYNC_SETTING_ENABLE.checked}'
            	}
            }]
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'hlayout',
            items: [{
                xtype: 'numberfield',
                itemId: 'rsync_download_rate',
                name: 'rsync_download_rate',
                fieldLabel: 'Maximum download rate (MB/s)',
                allowBlank: false,
                msgTarget: 'qtip', 
                maskRe: /^[0-9]*/,
                regex: /^[0-9]*/,
                regexText: 'Invalid number',
                listeners: {
                    blur: function(el) {
                        var me = this;

                        if (me.getValue() === null) {
                            return;
                        }

                        if (me.getValue().toString().indexOf('.') != -1) {
                            el.reset();
                        }
                    }
                },
				bind: {
                	value: '{rsync_data.rsync_download_rate}',
                	disabled: '{!RSYNC_SETTING_ENABLE.checked}'
            	}
            }]	
        },{
            xtype: 'container',
            qDefault: true,
            customLayout: 'vlayout',
            items: [{
            	reference: 'RSYNC_SERVER_ENABLE',
                xtype: 'checkboxfield',
                qDefault: true,
                boxLabel: 'Allow backup remote data to the NAS',
                itemId: 'rsync_server_enable',
                name: 'rsync_server_enable',
                labelFontWeight: 'bold',
                labelFontColor: 'title',
                inputValue: true,
                uncheckedValue: false,
				bind: {
                	value: '{rsync_data.rsync_server_enable}',
                	disabled: '{!RSYNC_SETTING_ENABLE.checked}'
            	}
            	
            }]
        },{
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'label',
                    text: 'User Credential:'
                },{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 100,
                    name: 'credential_type',
                    itemId: 'rsync_type',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', 'type_str'],
                        data: [{
                            "type": 'user',
                            "type_str": 'Local'
                        },{
                        	//"type": 'domain_user',
                            //"type_str": 'Domain'
                        }]
                    }),
                    valueField: 'type',
                    displayField: 'type_str',
                    queryMode: 'local',
                    listeners: {
                        select: 'onAccountTypeSelect',
                        render: function (combo) {
                            combo.select('user');
                        }
                    },
					bind: {
	                	disabled: '{!RSYNC_SERVER_ENABLE.checked}'
	            	}
                },{
                    xtype: 'combobox',
                    qDefault: true,
                    editable: false,
                    width: 100,
                    itemId: 'rsync_account',
                    name: 'account',
                    valueField: 'name',
                    displayField: 'name',
					bind: {
	                	disabled: '{!RSYNC_SERVER_ENABLE.checked}'
	            	}
                }]
            }]                    
        }]
    }]
});
