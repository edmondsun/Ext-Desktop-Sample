/**
 * @class Ext.ux.upload.Button
 * @extends Ext.button.Button
 *
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
Ext.define('DESKTOP.FileManager.uploader.UploaderButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.uploadbutton',
    requires: ['DESKTOP.FileManager.uploader.UploaderBasic'],
    constructor: function (config) {
        var me = this;
        config = config || {};
        Ext.applyIf(config.uploader, {
            browse_button: config.id || Ext.id(me)
        });
        me.callParent([config]);
    },
    initComponent: function () {
        var me = this,
            e;
        me.callParent();
        me.uploader = me.createUploader();
        if (me.uploader.drop_element && (e = Ext.ComponentQuery.query(me.uploader.drop_element)[0])) {
            e.addListener('afterRender', function () {
                me.uploader.initialize();
            }, {
                single: true,
                scope: me
            });
        } else {
            me.addListener('afterRender', function () {
                me.uploader.initialize();
            }, {
                single: true,
                scope: me
            });
        }
        me.relayEvents(me.uploader, ['beforestart',
            'uploadready',
            'uploadstarted',
            'uploadcomplete',
            'uploaderror',
            'filesadded',
            'beforeupload',
            'fileuploaded',
            'updateprogress',
            'uploadprogress',
            'storeempty'
        ]);
    },
    /**
     * @private
     */
    createUploader: function () {
        return Ext.create('DESKTOP.FileManager.uploader.UploaderBasic', this, Ext.applyIf({
            listeners: {}
        }, this.initialConfig));
    }
});
