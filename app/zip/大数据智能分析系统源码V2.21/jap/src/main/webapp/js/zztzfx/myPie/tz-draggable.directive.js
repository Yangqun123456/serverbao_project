/**
 * Created by mic on 2016/9/2.
 */
//写jQuery拖拽指令
//图形拖拽指令
zztzApp.directive('tzDraggable', function ($http, $document, pieDetail, tableDetail, $compile, $state, locals, LayoutStyleService, RenderPieService, ngDialog) {
    return {
        scope: false,
        restrict: 'A',
        link: linkFunc,
    };
    function linkFunc(scope, element, pieDetail) {
        //未被拖拽过两次的度量*****************************************************************************************************************

        if (element.parents("div[class*='mp_leftModel']").length != 0) {
            element.on('mousedown', function (event) {
                //获取当前拖拽的id
                // var worktablesObj = element[0].getAttribute('alt');
                var worktablesObj = element.children('a').attr('alt');
                var obj = eval('(' + worktablesObj + ')');
                if (!justingForTwice(obj)) {
                    zIndex++;
                    //记录元素在页面的初始位置
                    iXD = this.clientLeft;
                    iYD = this.clientTop + this.clientHeight;
                    //记录元素在页面的终止位置
                    var e = event || window.event;
                    oXD = iXD;
                    oYD = e.clientY - iYD;
                    //复制一个被拖拽元素div
                    var text = element.text();
                    element.parents("ul").after($compile(
                        "<div id='myPieDiv' class='mt_modelDiv'></div>"
                    )(scope));
                    element.parents("ul").next("div[id*='myPieDiv']").append($compile("<a class='fa fa-bar-chart' style='font-size:40px'></a>")(scope));
                    element.parents("ul").next("div[id*='myPieDiv']").append($compile("<p>" + text + "</p>")(scope));
                    element.parents("ul").next("div[id*='myPieDiv']").css({
                        "float": "none",
                        "background-color": "#ffffff",
                        "left": oXD + "px",
                        "top": oYD + "px",
                        "z-index": zIndex,
                        "position": "absolute",
                        "cursor": "move"
                    });
                    this.setCapture && this.setCapture();
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                    return false;
                } else {
                    ngDialogTips(ngDialog, "已存在，请不要重复拖拽!");
                    return true;
                }
            });


            //元素移动方法
            function mousemove(event) {
                var e = event || window.event;
                var widthD = 0; //weiduDiv子元素宽度和
                zIndex++;
                oXD = e.clientX - iXD;
                oYD = e.clientY - iYD;

                element.parents("ul").next("div[id*='myPieDiv']").css({
                    "left": (oXD - 50) + "px",
                    "top": (oYD - 80) + "px",
                    "z-index": zIndex,
                    "position": "absolute",
                    "cursor": "move"
                });
                LayoutStyleService.trigger_layout_click_event(true);
            }

            //元素拖拽结束方法
            var echartsDataType = "";

            function mouseup(event) {
                var layoutStyle = {};
                layoutStyle = LayoutStyleService.on_layout_style();
                console.log("come form on_layout_style:" + JSON.stringify(layoutStyle));
                //传送布局类型名称和class名称
                //格式{name:"layoutA",class:"layoutB",width:"",height:""}

                $('#layoutShowFlag').css('display', 'none');//移除提示
                if (oXD >= 203) {
                    //开始生成图表
                    var workDetail = eval('(' + element.children('a').attr("alt") + ')');
                    //alert(JSON.stringify(workTable));
                    //获取工作表详情
                    var obj = {};
                    var parentId = "echartsDiv" + workDetail.workTableId;
                    $http({
                        method: "GET",
                        url: ctx() + "/workTable/showWorkTable",
                        params: {"workTableId": workDetail.workTableId}
                    }).success(function (freetrial) {
                    	debugger;
                        obj = freetrial;
                        var echartsDataType = obj.dataType;//每个工作表的图表类型
                        tableDetail.tableDetail = obj;
                        XsColor = obj.xsColor;//x轴颜色
                        XwColor = obj.xwColor;//x文字颜色
                        YsColor = obj.ysColor;//y轴颜色
                        YwColor = obj.ywColor;//y文字颜色
                        echartsColorTheme=obj.themeId;//theme主题
                        //后台返回的json数据
                        	$http({
                                method: "POST",
                                url: ctx() + "/workTable/getKylinByCondition",
                                data: JSON.stringify(obj)
                            }).success(function (freetrial) {
                                var echartsData = freetrial;
                                // ngDialogTips(ngDialog,"echartsDataType:" + echartsDataType);
                                if (echartsData.success == true) {
                                    $("#mp_mainDiv").append($compile("<div  class = '" + layoutStyle.class + "' id='" + workDetail.workTableId + "'></div>")(scope));
                                    $("#" + workDetail.workTableId).append($compile("<div class='layout-overflow layout-border' ng-style='{\"border-color\": selectedLineForeColor}' ></div>")(scope));
                                    $("#" + workDetail.workTableId).children("div").last().append($compile("<div class='innerDivChartDataMenu'><div class='worktables-title'><span ng-style='{\"color\": selectedTitleFontForeColor}'>" + workDetail.workTableName + "</span></div><div class='right_menu'><i class='fa fa-bars right_menu_i_color' aria-hidden='true' menu-click=''></i></div><div class='dropdown-menu-bar display-control'><ul class='dropdown-menu'><li  ng-repeat='a in dropMenuList'><a ng-click='dropMenuClick({type:a.type,id:\"" + workDetail.workTableId + "\"})'>{{a.name}}</a></li></ul></div></div>")(scope));
                                    $("#" + workDetail.workTableId).children("div").last().append($compile("<div id='echartsDiv" + workDetail.workTableId + "' class = 'innerDivChartData' style='overflow-x: auto;'></div>")(scope));
                                    debugger;
                                    RenderPieService.judgingChartType(parentId, echartsData, $compile, scope, echartsDataType,obj.measures,obj.dimTable,obj.filters,obj.cubeId,$http);
                                }
                                else {
                                    ngDialogTips(ngDialog, "无数据！");
                                }

                            }).error(function (freetrial) {
                                ngDialogTips(ngDialog, "获取数据失败！");
                            });
                    }).error(function (freetrial) {
                        ngDialogTips(ngDialog, "获取数据失败！");
                    });

                    element.parents("ul").next("div[id*='myPieDiv']").remove();


                }
                else {
                    element.parents("ul").next("div[id*='myPieDiv']").remove();
                    zIndex--;
                }
                this.releaseCapture && this.releaseCapture();
                event.cancelBubble = true;


                //清除事件
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }

            //判断拖拽次数
            function justingForTwice(data) {

                if ($("#" + data.workTableId).length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }


        ////未被拖拽过两次的度量结束*****************************************************************************************************************
    }
})
//数据模型的绑定事件
zztzApp.directive('openInit', function ($http, $document, pieDetail, tableDetail, $compile, locals, $state, LayoutStyleService, RenderPieService, ngDialog) {
    var templated =
        '<div id="layoutShowFlag">' +
            '<div class="layout-select-big"><span>布局选择</span> </div> <div class="mp_leftTitle"><span>选择布局后，从左侧拖拽需要的数据分析至此</span></div>'+
        '<div class="mp-layout-common-big" >' +
        '<div ng-click="changeLayout(\'layoutA\')">' +
        '<div class="{{layObj[\'layoutA\']}} layout-a-div  "></div>' +
        '<div class="{{layObj[\'layoutA\']}} layout-a-div"></div>' +
        '</div>' +
        '<div ng-click="changeLayout(\'layoutB\')">' +
        '<div class=" layout-b-div {{layObj[\'layoutB\']}}"></div>' +
        '<div class=" layout-b-div  {{layObj[\'layoutB\']}}"></div>' +
        '</div>' +
        '<div  ng-click="changeLayout(\'layoutC\')">' +
        '<div class=" layout-c-div {{layObj[\'layoutC\']}}"></div>' +
        '<div class=" layout-c-div  {{layObj[\'layoutC\']}}"></div>' +
        '<div class=" layout-c-div   {{layObj[\'layoutC\']}}"></div>' +
        '<div class=" layout-c-div   {{layObj[\'layoutC\']}}"></div>' +
        '</div>' +
        '<div  ng-click="changeLayout(\'layoutD\')">' +
        '<div class=" layout-d-div {{layObj[\'layoutD\']}}"></div>' +
        '<div class=" layout-d-div  {{layObj[\'layoutD\']}}"></div>' +
        '<div class=" layout-d-div   {{layObj[\'layoutD\']}}"></div>' +
        '<div class=" layout-d-div   {{layObj[\'layoutD\']}}"></div>' +
        '<div class=" layout-d-div   {{layObj[\'layoutD\']}}"></div>' +
        '<div class=" layout-d-div   {{layObj[\'layoutD\']}}"></div>' +
        '</div>' +
        '<div ng-click="changeLayout(\'layoutE\')">' +
        '<div class="{{layObj[\'layoutE\']}} layout-e-div1  "></div>' +
        '<div class="{{layObj[\'layoutE\']}} layout-e-div2"></div>' +
        '</div>' +
        '<div ng-click="changeLayout(\'layoutF\')">' +
        '<div class="{{layObj[\'layoutF\']}} layout-f-div1  "></div>' +
        '<div class="{{layObj[\'layoutF\']}} layout-f-div2"></div>' +
        '</div>' +
        '</div>' +
        '</div>';

    return {
        scope: false,
        restrict: 'E',
        replace: true,
        template: '<div id="mp_mainDiv" open-init="" ng-style="{\'background-color\': selectedForeColor}">' +
        templated +
        '</div>',
        link: openInitFunc,
    };
    function openInitFunc(scope, element) {
        debugger;
        function themeDetail(){
            $http({
                method: "POST",
                url: ctx() + "/theme/getThemeList",
                params:{themeId:echartsColorTheme}
            }).success(function (freetrial) {
                // console.log("getThemeList:"+JSON.stringify(freetrial));
                if(freetrial!=null){
                    var theme=freetrial.data[0];
                    scope.selectedForeColor = theme.dashboardBackground;
                    scope.selectedLineForeColor = theme.dashboardBorder;
                    // scope.selectedTitleFontForeColor = theme.dashboardTitle;
                }
            }).error(function (freetrial) {
                console.log("查询数据异常！");
            });

        }
        themeDetail();

        var dropMenuList = [];
        var menunames = ['移除', '编辑', '边框'];
        var menutypes = ['remove', 'edit', 'border']
        for (var i = 0; i < menunames.length; i++) {
            var o = {};
            o.name = menunames[i];
            o.type = menutypes[i];
            dropMenuList.push(o);
        }
        scope.dropMenuList = dropMenuList;
        //workTableResults右上角点击事件
        scope.dropMenuClick = function (data) {
            // alert(JSON.stringify(data));

            if (data != null) {
                if (data.type == 'remove') {
                    //移除worktables
                    $("#" + data.id).remove();
                    if ($('#mp_mainDiv').children().length == $('#mp_mainDiv').children('#layoutShowFlag').length) {
                        //添加布局样式页面

                        $('#layoutShowFlag').css('display', 'block');//
                    }
                    //设置拖拽区域
                } else if (data.type == 'edit') {
                    //去往数据分析页面
                    var tables = pieDetail.tableDetails;
                    for (var index in tables) {
                        if (tables[index].workTableId == data.id) {
                            tableDetail.tableDetail = tables[index];
                        }

                    }
                    getMenu(locals);
                    $state.go("zztzfx.workPanel");


                } else if (data.type == 'border') {
                    var layoutBorder = $("#" + data.id).children().first();
                    if (layoutBorder.hasClass("layout-border")) {
                        layoutBorder.removeClass("layout-border");
                    } else {
                        layoutBorder.addClass("layout-border");
                    }

                    //边框设置
                } else if (data.type == 'setting') {
                    //其他设置
                }
            }


        }


        if (pieDetail.pieDetail != null) {
            var layoutStyle = {};
            layoutStyle = LayoutStyleService.on_layout_style();
            var layoutStyle = {};
            layoutStyle = LayoutStyleService.on_layout_style();
            console.log("come form on_layout_style:" + JSON.stringify(layoutStyle));
            //传送布局类型名称和class名称
            //格式{name:"layoutA",class:"layoutB",width:"",height:""}



            //获取workTableId入参
            var workTableIdObj = {
                "id": pieDetail.pieDetail.id,
                "name": pieDetail.pieDetail.name,
                "description": pieDetail.pieDetail.description

            };
            var myPie_main = document.getElementById("myPie_main");
            var mp_mainBar_nodes = myPie_main.childNodes;
            //仪表盘基本属性
            for (var d = 0; d < mp_mainBar_nodes.length; d++) {
                if (mp_mainBar_nodes[d].nodeName == "DIV") {
                    var mp_tabButton_nodes = mp_mainBar_nodes[d].childNodes;
                    for (var j = 0; j < mp_tabButton_nodes.length; j++) {
                        if (mp_tabButton_nodes[j].nodeName == "DIV") {
                            var mp_tabButton = mp_tabButton_nodes[j].childNodes;
                            for (var k = 0; k < mp_tabButton.length; k++) {
                                if (mp_tabButton[k].nodeName == "INPUT") {
                                    mp_tabButton[k].setAttribute("value", workTableIdObj.name);
                                    mp_tabButton[k].setAttribute("alt", workTableIdObj.id);
                                }
                            }
                        }
                    }
                }
            }
            //渲染工作表
            var echartsDataType = "";//每个工作表的图表类型
            $http({
                method: "GET",
                url: ctx() + "/dashboards/" + pieDetail.pieDetail.id,
                async: false,
                params: {}
            }).success(function (data) {
                // console.log("返回对象：" + JSON.stringify(data));
                layoutStyle.class = data.layout;

                LayoutStyleService.trigger_layout_default_style(scope, 'sibling', 'layout_default_style', data.layout);
                // LayoutStyleService.trigger_layout_click_event(true);
                scope.selectedForeColor = data.backgroundColor;
                scope.selectedTitleFontForeColor = data.titleFontColor;
                echartsColorTheme=data.themeId;//theme主题
                var workDetail = {};

                pieDetail.tableDetails = data.workTableResults;
                if(data.workTableResults.length>0){
                    $('#layoutShowFlag').css('display', 'none');//移除提示
                }
                for (var z1 = 0; z1 < data.workTableResults.length; z1++) {
                    workDetail = data.workTableResults[z1];
                    echartsDataType = workDetail.dataType;//每个工作表的图表类型
                    scope.selectedLineForeColor = workDetail.tableBorderColor;
                    var parentId = "echartsDiv" + workDetail.workTableId;
                    //先渲染工作表边框
                    var echartsData = workDetail.result;
                    if ((echartsData==null&&(echartsDataType=="step"||echartsDataType=="steptext"))||echartsData.success == true) {
                        XsColor = workDetail.xsColor//x轴颜色
                        XwColor = workDetail.xwColor;//x文字颜色
                        YsColor = workDetail.ysColor;//y轴颜色
                        YwColor = workDetail.ywColor;//y文字颜色
                        $("#mp_mainDiv").append($compile("<div  class = '" + layoutStyle.class + "' id='" + workDetail.workTableId + "'></div>")(scope));
                        $("#" + workDetail.workTableId).append($compile("<div class='layout-overflow " + workDetail.tableBorderShow + "' ng-style='{\"border-color\": selectedLineForeColor}' ></div>")(scope));
                        $("#" + workDetail.workTableId).children("div").last().append($compile("<div class='innerDivChartDataMenu'><div class='worktables-title'><span ng-style='{\"color\": selectedTitleFontForeColor}'>" + workDetail.workTableName + "</span></div><div class='right_menu'><i class='fa fa-bars right_menu_i_color' aria-hidden='true' menu-click=''></i></div><div class='dropdown-menu-bar display-control'><ul class='dropdown-menu'><li  ng-repeat='a in dropMenuList'><a ng-click='dropMenuClick({type:a.type,id:\"" + workDetail.workTableId + "\"})'>{{a.name}}</a></li></ul></div></div>")(scope));
                        $("#" + workDetail.workTableId).children("div").last().append($compile("<div id='echartsDiv" + workDetail.workTableId + "' class = 'innerDivChartData' style='overflow-x: auto;'></div>")(scope));
                        debugger;
                        RenderPieService.judgingChartType(parentId, echartsData, $compile, scope, echartsDataType,data.workTableResults[z1].measures,data.workTableResults[z1].dimTable,data.workTableResults[z1].filters,data.workTableResults[z1].cubeId,$http);
                    }
                    else {
                        ngDialogTips(ngDialog, "无数据！");
                    }
                }
            }).error(function (data) {
                ngDialogTips(ngDialog, "获取数据失败!");
                console.log("获取数据失败");
            });


        }
    }


});

function getMenu(locals){
	var obj={
			"currentName":angular.element("#menu_zztz").find("#menu_workPanel").attr("id")
	}
	locals.setObject("href",obj);
	angular.element("#menu_zztz").find("#menu_workPanel").addClass("active");
	angular.element("#menu_zztz").find("#menu_workPanel").siblings("li").removeClass("active");
};