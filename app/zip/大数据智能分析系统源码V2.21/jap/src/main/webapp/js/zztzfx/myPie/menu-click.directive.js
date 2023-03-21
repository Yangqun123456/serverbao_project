zztzApp.directive('menuClick', function ($http, $document, $compile) {
    var directive = {
        replace: false,
        restrict: 'A',
        link: linkFunc
    };
    return directive;
    function linkFunc($scope, element, attr) {
        //鼠标over和click事件
        element.on('mouseover', function () {
            var current = element.parent().last().parent().children().last();
            current.removeClass("display-control");
        });
        element.on('click', function () {
            var current = element.parent().last().parent().children().last();
            if (!current.hasClass("display-control")) {
                current.addClass("display-control");
            } else {
                current.removeClass("display-control");
            }
        });
        element.on('blur', function () {
            current.addClass("display-control");
        });
        element.on('mouseout', function () {
            var current = element.parent().last().parent().children().last();
            current.on('mouseleave', function () {
                current.addClass("display-control");
            })
            current.on('click', function () {
                current.addClass("display-control");
            })

        });


    }
})