/**
 * [extend description]
 * qConstrainHeader: support component dragging overflow container
 */
Ext.define('DESKTOP.ux.util.ComponentDragger', {
    extend: 'Ext.util.ComponentDragger',
    /* copy from Ext.dd.DragTracker */
    constrainModes: {
        point: function (me, xy) {
            var dr = me.dragRegion,
                constrainTo = me.getConstrainRegion();
            if (!constrainTo) {
                return xy;
            }
            dr.x = dr.left = dr[0] = dr.right = xy[0];
            dr.y = dr.top = dr[1] = dr.bottom = xy[1];
            dr.constrainTo(constrainTo);
            return [dr.left, dr.top];
        },
        dragTarget: function (me, xy) {
            var s = me.startXY,
                dr = me.startRegion.copy(),
                constrainTo = me.getConstrainRegion(),
                adjust;
            /* qConstrainHeader: mininum visible width */
            var qAdjust = 40;
            if (!constrainTo) {
                return xy;
            }
            dr.translateBy(xy[0] - s[0], xy[1] - s[1]);
            /* qConstrainHeader: patch for dragging to right-hand-side of container */
            if (constrainTo.right - dr.left < qAdjust) {
                adjust = qAdjust - (constrainTo.right - dr.left);
                xy[0] += -adjust;
                dr.left += -adjust;
            }
            /* qConstrainHeader: patch for dragging to left-hand-side of container */
            if (constrainTo.left - dr.right > -qAdjust) {
                adjust = qAdjust + (constrainTo.left - dr.right);
                xy[0] += adjust;
            }
            if (dr.bottom > constrainTo.bottom) {
                xy[1] += adjust = (constrainTo.bottom - dr.bottom);
                dr.top += adjust;
            }
            if (dr.top < constrainTo.top) {
                xy[1] += (constrainTo.top - dr.top);
            }
            return xy;
        }
    }
});
