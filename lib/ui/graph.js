(function ($, global) {
    global.arctor = global.arctor || {};

    global.arctor.Renderer = function Renderer(canvasId) {
        var canvas = $(canvasId).get(0),
            ctx = canvas.getContext("2d"),
            colors = {
                green: '#07C500'
            },
            _system,
            self;

        self = {
            init: function (system) {
                _system = system;
                _system.screenSize(canvas.width, canvas.height);
                _system.screenPadding(80); // leave an extra 80px of whitespace per side
                self.initMouseHandling();
            },

            redraw: function () {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                _system.eachEdge(function (edge, pt1, pt2) {
                    var gradient = ctx.createLinearGradient(pt1.x, pt1.y, pt2.x, pt2.y);
                    gradient.addColorStop(0, colors.green);
                    gradient.addColorStop(0.3, edge.data.color);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);
                    ctx.stroke();
                });

                _system.eachNode(function (node, pt) {
                    var r = 30;

                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.globalAplha = node.data.main ? 1 : 0;
                    ctx.arc(pt.x, pt.y, r, 0, 360);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = node.data.color;
                    ctx.font = "0.75em 'Trebuchet MS', Helvetica, sans-serif";
                    ctx.strokeText(node.data.title, pt.x, pt.y + 3);
                    ctx.stroke();
                });
            },

            initMouseHandling: function () {
                var _mouseP,
                    _dragged,
                    handler;

                handler = {
                    clicked: function (e) {
                        var pos = $(canvas).offset();

                        _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
                        _dragged = _system.nearest(_mouseP);

                        if (_dragged && _dragged.node !== null) {
                            _dragged.node.fixed = true;
                        }

                        $(canvas).bind('mousemove', handler.dragged);
                        $(window).bind('mouseup', handler.dropped);

                        return false;
                    },

                    dragged: function (e) {
                        var pos = $(canvas).offset(),
                            s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);

                        if (_dragged && _dragged.node !== null) {
                            _dragged.node.p = _system.fromScreen(s);
                        }

                        return false;
                    },

                    dropped: function (e) {
                        if (!_dragged || _dragged.node === undefined) {
                            return;
                        }

                        if (_dragged.node !== null) {
                            _dragged.node.fixed = false;
                        }

                        _dragged.node.tempMass = 1000;
                        _dragged = null;
                        $(canvas).unbind('mousemove', handler.dragged);
                        $(window).unbind('mouseup', handler.dropped);
                        _mouseP = null;

                        return false;
                    }
                };

                $(canvas).mousedown(handler.clicked);
            }

        };
        return self;
    };
}(jQuery, window));
