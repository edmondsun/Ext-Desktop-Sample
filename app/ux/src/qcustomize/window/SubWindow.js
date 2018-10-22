/**
 * [extend description]
 */
Ext.define('DESKTOP.ux.qcustomize.window.SubWindow', {
    extend: 'DESKTOP.ux.qcustomize.window.MainWindow',
    alias: 'widget.subwindow',
    cls: 'qsan_subwindow',
    /* [start] default config */
    bodyPadding: 20,
    closable: false,
    resizable: false,
    header: {
        titleAlign: "center"
    },
    /* [end] default config */
    config: {
        /**
         * parentMask: Boolean
         * default: false
         * description: [true] support parent/child window mask mechiasm
         */
        parentMask: false
    },
    listeners: {
        beforerender: function (me) {
            me.handleParentWindowMask(true);
        },
        destroy: function (me) {
            me.handleParentWindowMask(false);
        }
    },
    handleParentWindowMask: function (isMask) {
        var me = this,
            parentWindow = Ext.getCmp(me.parentWindowId);
        if (me.getParentMask() === false) {
            return false;
        }
        Ext.apply(parentWindow, {
            qIsMasked: isMask
        });
        if (isMask) {
            parentWindow.getController().showLoadingMask(false);
        } else {
            parentWindow.getController().hideLoadingMask();
        }
    }
});
