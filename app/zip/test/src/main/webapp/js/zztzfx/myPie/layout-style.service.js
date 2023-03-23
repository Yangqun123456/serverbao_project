/**
 * Created by mic on 2016/9/2.
 */
//更改布局样式

//更改布局样式

zztzApp.factory('LayoutStyleService', LayoutStyleService);
function LayoutStyleService() {
    var data = {};
    var layoutFlag = false;
    var produce_custome_div_sum=0;
    var service = {
        on_layout_style: on_layout_style,
        trigger_layout_style: trigger_layout_style,
        trigger_layout_click_event: trigger_layout_click_event,
        get_layout_click_event: get_layout_click_event,
        trigger_layout_default_style: trigger_layout_default_style,
        on_layout_default_style: on_layout_default_style,
        produce_div_sum: produce_div_sum,
        custome_div_sum: custome_div_sum,
        get_produce_custome_div_sum:get_produce_custome_div_sum,
    }
    return service;

    /**
     * 生产拖拽div
     */
    function produce_div_sum() {
        produce_custome_div_sum++;

    }
    function get_produce_custome_div_sum() {
        return produce_custome_div_sum;
    }

    function custome_div_sum() {
        produce_custome_div_sum--;
        if (produce_custome_div_sum < 0) {
            produce_custome_div_sum = 0;
        }
    }

    function on_layout_style() {
        return data;
    }

    //中途不可以修改样式
    function trigger_layout_style(d) {
        data = d;
    }

    function trigger_layout_click_event(flag) {
        layoutFlag = flag;
    }

    function get_layout_click_event() {
        return layoutFlag;
    }

    //接收数据
    function on_layout_default_style($scope, type, f) {
        $scope.$on(type, function (event, data) {
            f(data);
            event.stopPropagation = true;
        })
    }

    //触发事件
    function trigger_layout_default_style($scope, deriction, type, data) {
        // direction 根据 A 和 B 的关系来定，父子用up或down，兄弟用sibling
        if (deriction === 'up') {
            $scope.$emit(type, data);
        } else if (deriction === 'down') {
            $scope.$broadcast(type, data);

        } else if (deriction === 'sibling') {
            //兄弟controller
            $scope.$parent.$broadcast(type, data);
        }
    }


    /**
     * controller调用
     * trigger_layout_style($scope,'sibling','layout_default_style',data);
     *
     *
     *  on_layout_style($scope, 'event_name', function(data){
     *   // do something here
     *  });
     */

}