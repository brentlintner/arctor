require.define('lib/browser/graph/renderer', function (require, module) {
    function renderer(canvasId) {
        var canvas = jQuery(canvasId).get(0),
            ctx = canvas.getContext("2d"),
            colors = {
                red: '#FF1717',
                white: '#FFFFFF',
                black: '#000000',
                grey: '#AAAAAA',
                lightblue: '#487DFF'
            },

            chk_showExternalModules = "#show-external-modules",

            opts = {},
            system,

            self = {
                init: function (s) {
                    var key = "arctor-show-external-modules",
                        setting = localStorage[key];

                    opts.showExternalModules = setting != "false";

                    if (!opts.showExternalModules) {
                        jQuery(chk_showExternalModules).removeAttr('checked');
                    }

                    jQuery(chk_showExternalModules).click(function () {
                        opts.showExternalModules = this.checked;
                        localStorage[key] = opts.showExternalModules;
                    });

                    jQuery("html").keypress(function (evt) {
                        if (evt.which === 32) {
                            system.stop();
                            event.preventDefault();
                        }
                    });

                    system = s;
                    system.screenSize(canvas.width, canvas.height);
                    system.screenPadding(80);
                    self.initMouseHandling()
                },

                redraw: function () {
                    var noderadius = 20;

                    ctx.fillStyle = colors.white;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    system.eachEdge(function (edge, pt1, pt2) {
                        // HACK!
                        if (!opts.showExternalModules &&
                            (edge.source.data.color === colors.lightblue ||
                             edge.target.data.color === colors.lightblue)) {
                            return;
                        }

                        var dx = pt2.x - pt1.x,
                            dy = pt2.y - pt1.y,
                            arrowangle = Math.PI / 16,
                            lineangle = Math.atan2(dy, dx),
                            d = 30,
                            h = Math.abs(d / Math.cos(arrowangle)),
                            angle1 = lineangle + Math.PI + arrowangle,
                            topx = pt2.x + Math.cos(angle1) * h,
                            topy = pt2.y + Math.sin(angle1) * h,
                            angle2 = lineangle + Math.PI - arrowangle,
                            botx = pt2.x + Math.cos(angle2) * h,
                            boty = pt2.y + Math.sin(angle2) * h;

                        ctx.globalAlpha = 0.2;
                        ctx.strokeStyle = colors.grey;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);

                        ctx.stroke();

                        ctx.lineWidth = 2;

                        // arrow
                        ctx.moveTo(topx, topy);
                        ctx.lineTo(pt2.x, pt2.y);
                        ctx.lineTo(botx, boty);
                        ctx.moveTo(botx, boty);
                        ctx.arcTo(topx, topy, botx, boty, 40);

                        ctx.stroke();

                        ctx.globalAlpha = 1;
                        ctx.fillStyle = colors.grey;
                        ctx.fill()
                    })

                    system.eachNode(function (node, pt) {
                        // HACK!
                        if (!opts.showExternalModules && node.data.color === colors.lightblue) {
                            return;
                        }

                        ctx.globalAlpha = 1;
                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.globalAplha = node.data.main ? 1 : 0;
                        ctx.arc(pt.x, pt.y, noderadius, 0, 360);
                        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                        ctx.fill();
                        ctx.closePath();

                        ctx.beginPath();
                        ctx.textAlign = 'center';

                        ctx.strokeStyle = node.data.color;

                        ctx.font = "12px Helvetica, Arial, sans-serif";
                        ctx.strokeText(node.data.title, pt.x, pt.y + 3);
                        ctx.stroke();
                        ctx.closePath()
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
