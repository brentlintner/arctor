$(window).ready(function () {
    var deps = window.deps,
        colors = {
            blue: '#3333FF',
            red: '#FF1717',
            green: '#07C500',
            grey: '#333333',
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
            sys.addNode(nodes[path].id, opts);
        }
        return nodes[path];
    }

    Object.keys(deps).forEach(function (key) {
        var dep = deps[key],
            base = addNode(key, {
                color: colors.grey,
                title: key
            });

        dep.forEach(function (item) {
            var node = addNode(item.path, {
                color: item.relative ? colors.grey : colors.blue,
                title: item.path
            });

            sys.addEdge(base.id, node.id, {
                color: colors.lightgrey
            });
        });
    });

    $('#viewport').attr({
        height: $(document).height() - 160,
        width: $(document).width() - 160
    });

    sys.parameters({stiffness: 100, repulsion: 5000, gravity: true, dt: 0.015});
    sys.renderer = arctor.Renderer("#viewport");
});
