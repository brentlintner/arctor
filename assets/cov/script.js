window.addEventListener('load', function () {
    (function () {
        var h1s = document.querySelectorAll('h1'), x;

        for (x = 0; x < h1s.length; x++) {
            (function (node) {
                node.addEventListener('click', function () {
                    var sibling = node.nextSibling.nextSibling,
                        klass = sibling.getAttribute('class') !== 'viewable' ? 'viewable' : '';
                    sibling.setAttribute('class', klass)
                })
            }(h1s[x]))
        }
    }());
});
