var ctx = function () {
    var path = window.location.href;
    var pathName = window.location.pathname;
    var hostPath = path.substring(0, path.indexOf(pathName))
    var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
    return (hostPath + projectName);
}
//数据模型的绑定事件
zztzApp.controller('myPie', function ($scope, $http, $state, $compile, pieDetail, locals, LayoutStyleService, ngDialog,RenderPieService) {
    $scope.queryWorkTable = function () {
        $http({
            method: "GET",
            url: ctx() + "/workTable/queryWorkTable",
            params: {}
        }).success(function (data) {
            $scope.workTableList = data;
            // console.log("获取数据成功" + JSON.stringify(data));
        }).error(function (data) {
            ngDialogTips(ngDialog, "获取数据失败!");
            console.log("获取数据失败");
        });
    };

    $scope.relocation = function () {
        var obj = {
            "currentName": "menu_workPanel"
        }
        locals.setObject("href", obj);
        angular.element("#menu_zztz").find("#menu_workPanel").addClass("active");
        angular.element("#menu_zztz").find("#menu_workPanel").siblings("li").removeClass("active");
        $state.go("zztzfx.workPanel");
    }
    //新建Pie
    $scope.newPie = function () {
    	debugger;
        // 清空画布上的所有echart图形
        var echartPic = $('#mp_mainDiv').children();
        for (var i = 0; i < echartPic.length; i++) {
            if (echartPic[i].id != 'layoutShowFlag') {
                $('#' + echartPic[i].id).remove();
            }
        }
        var dashboardO = angular.element('#dashboardNameInput')[0];
        dashboardO.value = '新建仪表盘';
        dashboardO.alt = '';
        $('#layoutShowFlag').css('display', 'block');



    };
    //改变布局
    var data = {};
    data.name = "layoutA";
    data.class = "layoutA";
    data.width = "98%";
    data.height = "450px";
    var layObj = [];
    var layoutFlag = false;
    // LayoutStyleService.trigger_layout_style($scope,'sibling','event_name',data);
    LayoutStyleService.trigger_layout_style(data);
    LayoutStyleService.on_layout_default_style($scope, "layout_default_style", function (data) {
        // do something
        console.log("on_layout_default_style do something:" + data);
        if (data != null && data != "") {
            default_layout(data);
        }
    });

    function default_layout(defaultStyle) {
        layObj['layoutA'] = "line_color_unselected";
        layObj['layoutB'] = "line_color_unselected";
        layObj['layoutC'] = "line_color_unselected";
        layObj['layoutD'] = "line_color_unselected";
        layObj[defaultStyle] = "line_color_selected";
        $scope.layObj = layObj;
        currentLayout = defaultStyle;

    }

    $scope.default_layout = default_layout("layoutA");
    $scope.changeLayout = function (layout) {
    	debugger;
        //用于判断是否可以改变布局
        if ($('#mp_mainDiv').children().length == $('#mp_mainDiv').children('#layoutShowFlag').length) {
            if (layout != currentLayout) {
                layObj[currentLayout] = "line_color_unselected";
                currentLayout = layout;
                layObj[layout] = "line_color_selected";
                data.name = currentLayout;
                data.class = currentLayout;
                if (layout == 'layoutA') {
                    data.width = "48%";
                    data.height = "450px";
                } else if (layout == 'layoutB') {
                    data.width = "98%";
                    data.height = "450px";
                } else if (layout == 'layoutC') {
                    data.width = "48%";
                    data.height = "300px";
                } else if (layout == 'layoutD') {
                    data.width = "30%";
                    data.height = "300px";
                }else if (layout == 'layoutE') {
                    data.width = "30%";
                    data.height = "450px";
                }else if (layout == 'layoutF') {
                    data.width = "30%";
                    data.height = "450px";
                }
                // LayoutStyleService.trigger_layout_style($scope,'sibling','event_name',data);

                LayoutStyleService.trigger_layout_style(data);
            }
        }
    }
    //全局背景点击事件
    //点击设置
    $scope.bgSettings = function () {
        if ($("#bgSettingSelected").hasClass("display-control")) {
            $("#bgSettingSelected").removeClass("display-control");
        } else {
            $("#bgSettingSelected").addClass("display-control");
        }
    }
    $scope.themeSettings = function () {
        if ($("#themeColorId").hasClass("display-control")) {
            $("#themeColorId").removeClass("display-control");
        } else {
            $("#themeColorId").addClass("display-control");
        }
    }
    $scope.getThemeList = function(){
    	debugger;
        $http({
            method: "POST",
            url: ctx() + "/theme/getThemeList",
            params:{}
        }).success(function (freetrial) {
            // console.log("getThemeList:"+JSON.stringify(freetrial));
            if(freetrial!=null){
                $scope.themeList=freetrial.data;
            }
        }).error(function (freetrial) {
            console.log("查询数据异常！");
        });

    }
    $scope.themeColorPicked=function (theme) {
    	//切换主题置空工作表原有坐标颜色
    	XsColor = "";//x轴颜色
        XwColor = "";//x文字颜色
        YsColor = "";//y轴颜色
        YwColor = "";//y文字颜色
        // 清空画布上的所有echart图形
        var echartPic = $('#mp_mainDiv').children();
        var ids=[];
        for (var i = 0; i < echartPic.length; i++) {
            if (echartPic[i].id != 'layoutShowFlag') {
                var currentDIV=$('#echartsDiv' + echartPic[i].id);
                ids.push({workTableId:echartPic[i].id});
                var id='#echartsDiv' + echartPic[i].id;
                var type=currentDIV.alt;
                currentDIV.empty();
            }
        }
        echartsColorTheme=theme.themeId;
        $scope.selectedForeColor = dynamicSetColor(theme.dashboardBackground);
        $scope.selectedLineForeColor = dynamicSetColor(theme.dashboardBorder);
        $scope.selectedTitleFontForeColor = dynamicSetColor(theme.dashboardTitle);
        headerColor=theme.dashboardTitle;//表格header颜色
        bodyColor=theme.dashboardTitle;//表格内容颜色
        tableColor=theme.dashboardTitle;//表格边框颜色
        
        if(ids.length>0) {
            $http({
                method: "POST",
                url: ctx() + "/workTable/getKylinListByCondition",
                async: false,
                data: {"workTables": ids}
            }).success(function (data) {
                console.log("获取数据成功" + JSON.stringify(data));
                for (var z1 = 0; z1 < data.workTableResults.length; z1++) {
                    workDetail = data.workTableResults[z1];
                    var echartsDataType = workDetail.dataType;//每个工作表的图表类型
                    //先渲染工作表边框
                    var echartsData = workDetail.result;
                    if (echartsData.success == true) {
                        var parentId = "echartsDiv" + workDetail.workTableId;
                        debugger;
                        RenderPieService.judgingChartType(parentId, echartsData, $compile, $scope, echartsDataType,data.workTableResults[z1].measures,data.workTableResults[z1].dimTable,data.workTableResults[z1].filters,data.workTableResults[z1].cubeId,$http);
                    }
                    else {
                        ngDialogTips(ngDialog, "无数据！");
                    }
                }

            })
        }
        $("#themeColorId").addClass("display-control");
    }
    //背景和边框默
    var defaultColor = "#f2f2f2";
    $scope.defaultColor = defaultColor;
    $scope.selectedForeColor = dynamicSetColor(defaultColor);
    $scope.selectedLineForeColor = dynamicSetColor("red");
    $scope.selectedTitleFontForeColor = dynamicSetColor("");
    // 动态设置默认颜色
    $scope.dynamicSetColor = dynamicSetColor;
    var bgOrBorderColor = "";
    $scope.bgColorPicked = function () {
        bgOrBorderColor = "bgColor";
    }
    $scope.bgBorderColorPicked = function () {
        bgOrBorderColor = "borderColor";
    }
    $scope.fontColorPicked = function () {
        bgOrBorderColor = "titleFontColor";

    }
    function dynamicSetColor(color) {
        return color;
    }

    // 选择事件
    $scope.$on('colorPicked', function (event, color) {
        if (bgOrBorderColor == 'bgColor') {
            $scope.selectedForeColor = color;
        } else if (bgOrBorderColor == 'borderColor') {
            $scope.selectedLineForeColor = color;
        } else if (bgOrBorderColor = 'titleFontColor') {
            $scope.selectedTitleFontForeColor = color;

        }
        $("#bgSettingSelected").addClass("display-control");
    })
//

});