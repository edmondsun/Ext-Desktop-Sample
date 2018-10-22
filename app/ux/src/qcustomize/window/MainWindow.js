/**
 * [extend description]
 */
Ext.define('DESKTOP.ux.qcustomize.window.MainWindow', {
    extend: 'Ext.window.Window',
    renderTo: 'windowContainer',
    focusOnToFront: false,
    constrainHeader: true,
    monitorOnWinMgr: true,
    config: {
        /**
         * qConstrainHeader: Boolean
         * default: false
         * description: support component dragging overflow container
         */
        qConstrainHeader: true,
        /**
         * qIsMasked: Boolean
         * default: false
         * description: [true] open the child window and mask the parent window
         */
        qIsMasked: false
    },
    /* copy from Ext.Component */
    beforeSetPosition: function (x, y, animate) {
        var me = this,
            pos = null,
            x0, hasX, hasY, adj;
        if (x) {
            if (Ext.isNumber(x0 = x[0])) {
                animate = y;
                y = x[1];
                x = x0;
            } else if ((x0 = x.x) !== undefined) {
                animate = y;
                y = x.y;
                x = x0;
            }
        }
        if (me.constrain || me.constrainHeader) {
            pos = me.calculateConstrainedPosition(null, [
                x,
                y
            ], true);
            if (pos) {
                if (me.qConstrainHeader !== true) {
                    x = pos[0];
                }
                y = pos[1];
            }
        }
        hasX = (x !== undefined);
        hasY = (y !== undefined);
        if (hasX || hasY) {
            me.x = x;
            me.y = y;
            adj = me.adjustPosition(x, y);
            pos = {
                x: adj.x,
                y: adj.y,
                anim: animate,
                hasX: hasX,
                hasY: hasY
            };
        }
        return pos;
    },
    privates: {
        initDraggable: function () {
            this.initSimpleDraggable();
        },
        initSimpleDraggable: function () {
            var me = this,
                ddConfig, dd;
            if (!me.header) {
                me.updateHeader(true);
            }
            if (me.header) {
                ddConfig = Ext.applyIf({
                    el: me.el,
                    delegate: '#' + me.header.id
                }, me.draggable);
                if (me.constrain || me.constrainHeader) {
                    ddConfig.constrain = me.constrain;
                    ddConfig.constrainDelegate = me.constrainHeader;
                    ddConfig.constrainTo = me.constrainTo || me.container;
                }
                /* qConstrainHeader */
                if (me.qConstrainHeader === true) {
                    dd = me.dd = new DESKTOP.ux.util.ComponentDragger(me, ddConfig);
                } else {
                    dd = me.dd = new Ext.util.ComponentDragger(me, ddConfig);
                }
                me.relayEvents(dd, ['dragstart', 'drag', 'dragend']);
                if (me.maximized) {
                    dd.disable();
                }
            }
        },
        onHeaderClick: function (header, e) {
            var delegate;
            if (header.el.contains(e.getTarget())) {
                delegate = this.getDefaultFocus();
                if (delegate) {
                    delegate.focus();
                }
            }
        },
        initResizable: function () {
            this.callParent(arguments);
            if (this.maximized) {
                this.resizer.disable();
            }
        }
    }
});
