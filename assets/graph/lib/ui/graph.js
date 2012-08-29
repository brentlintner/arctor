require.define('lib/ui/graph', function (require, module) {
    var renderer = require('lib/ui/graph/renderer').renderer;

    function drawGraph() {
        var deps = window.deps,
            colors = {
                blue: '#3333FF',
                lightblue: '#487DFF',
                red: '#FF1717',
                green: '#07C500',
                grey: '#666666',
                lightgrey: '#CCCCCC'
            },
            nodes = {},
            count = 0,
            sys = arbor.ParticleSystem();

        function addNode(path, opts) {
            if (!nodes[path]) {
                count++;
                nodes[path] = {
                    id: count,
                    path: path
                };
                sys.addNode(nodes[path].id, opts)
            }
            return nodes[path];
        }

        function viewportHeight() {
            var dh = jQuery(document).height(),
                // TODO: this needs to be more linear (and not hacked out)
                h = parseInt(count / (count.toString().split('').length / 190), 10);
            return h > dh ? dh : h;
        }

        function viewportWidth() {
            var dw = jQuery(document).width(),
                // TODO: this needs to be more linear (and not hacked out)
                w = parseInt(count / (count.toString().split('').length / 190), 10);
            return w > dw ? dw : w;
        }

        Object.keys(deps).forEach(function (key) {
            var dep = deps[key],
                base = addNode(key, {
                    color: dep.external ? colors.lightblue : colors.grey,
                    title: key
                });

            dep.forEach(function (item) {
                var node = addNode(item.path, {
                    color: item.external ? colors.lightblue : colors.grey,
                    title: item.path
                });

                sys.addEdge(base.id, node.id, {
                    color: colors.lightgrey
                })
            })
        });

        jQuery('#viewport').attr({
            height: viewportHeight(),
            width: viewportWidth()
        });

        sys.parameters({stiffness: 100, repulsion: 1000, gravity: true, dt: 0.015});
        sys.renderer = renderer("#viewport")
    }

    module.exports.draw = drawGraph
});
