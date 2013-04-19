require.define('lib/browser/graph/renderer', function (require, module) {
    function renderer(canvasId) {
        var canvas = jQuery(canvasId).get(0),
            ctx = canvas.getContext("2d"),
            colors = {
                red: '#FF1717',
                white: '#FFFFFF'
            },
            system,

            self = {
                init: function (s) {
                    system = s;
                    system.screenSize(canvas.width, canvas.height);
                    system.screenPadding(80);
                    self.initMouseHandling()
                },

                redraw: function () {
                    ctx.fillStyle = colors.white;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    system.eachEdge(function (edge, pt1, pt2) {
                        var gradient = ctx.createLinearGradient(pt1.x, pt1.y, pt2.x, pt2.y);
                        gradient.addColorStop(1, colors.red);
                        gradient.addColorStop(0.5, edge.data.color);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 4;
                        ctx.beginPath();
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);
                        ctx.stroke()
                    })

                    system.eachNode(function (node, pt) {
                        var r = 20;

                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.globalAplha = node.data.main ? 1 : 0;
                        ctx.arc(pt.x, pt.y, r, 0, 360);
                        ctx.fillStyle = colors.white;
                        ctx.fill();
                        ctx.closePath();

                        ctx.beginPath();
                        ctx.textAlign = 'center';
                        ctx.strokeStyle = node.data.color;
                        ctx.font = "12px Helvetica, Arial, sans-serif";
                        ctx.strokeText(node.data.title, pt.x, pt.y + 3);
                        ctx.stroke()
                        ctx.closePath();
                    })
                },

                initMouseHandling: function () {
                    var mouseP,
                        dragged,
                        handler;

                    handler = {
                        clicked: function (e) {
                            var pos = jQuery(canvas).offset();

                            mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
                            dragged = system.nearest(mouseP);

                            if (dragged && dragged.node !== null) {
                                dragged.node.fixed = true
                            }

                            jQuery(canvas).bind('mousemove', handler.dragged);
                            jQuery(window).bind('mouseup', handler.dropped);

                            return false
                        },

                        dragged: function (e) {
                            var pos = jQuery(canvas).offset(),
                                s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);

                            if (dragged && dragged.node !== null) {
                                dragged.node.p = system.fromScreen(s)
                            }

                            return false
                        },

                        dropped: function () {
                            if (!dragged || dragged.node === undefined) {
                                return
                            }

                            if (dragged.node !== null) {
                                dragged.node.fixed = false
                            }

                            dragged.node.tempMass = 1000;
                            dragged = null;
                            jQuery(canvas).unbind('mousemove', handler.dragged);
                            jQuery(window).unbind('mouseup', handler.dropped);
                            mouseP = null;

                            return false
                        }
                    }

                    jQuery(canvas).mousedown(handler.clicked)
                }
            }

        return self
    }

    module.exports.renderer = renderer
});
