/**
 * Created by mic on 2016/9/2.
 */

//保存echarts数据指令
zztzApp.directive('savepie', function ($compile, $http, LayoutStyleService, ngDialog) {
    return {
        $scope: false,
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on("click", function () {
                var layoutStyle = LayoutStyleService.on_layout_style();
                var borderStyle = LayoutStyleService.on_layout_style();
                //前台传的维度和度量对象参数
                var obj = new Object();
                var workTables = new Array();//度量列
                var titleFontColor = "";//标题颜色
                //度量
                if ($("#mp_mainDiv").children().length >$("#mp_mainDiv").children("#layoutShowFlag").length ) {
                    var order = 0;
                    $("#mp_mainDiv").children("div").each(function () {
//                        var ooD = eval("(" + $(this).attr("id") + ")");//字符串转化成对象,维度条件对象
//                        var wrokTableId = ooD.wrokTableId;
                        var id = $(this).attr("id");
                        if(id!='layoutShowFlag') {
                            var tableBorderShowFlag = $(this).children("div").last().hasClass("layout-border");
                            var tableBorderColor = $(this).children("div").last().css("border-color");
                            titleFontColor = $(this).find('span').css('color');
                            // var titleFontWeight = $(this).find('span').css('font-weight');
                            var titleShow = "";
                            // var titleFontSize = $(this).find('span').css('font-size');
                            if (tableBorderShowFlag) {
                                var tableBorderShow = "layout-border";
                            }
                            var tableBorderWidth = 0;
                            var oNewD = {
                                workTableId: id,
                                workTableOrder: order,
                                tableBorderShow: tableBorderShow,
                                tableBorderColor: tableBorderColor,
                            };//新的入参对象
                            order++;
                            workTables.push(oNewD);
                        }
                    });
                }
                //前台传给后台的入参对象
                debugger;
                var dashboardO = angular.element('#dashboardNameInput')[0];
                var dashboardName = dashboardO.value;
                var dashboardId = dashboardO.alt;
                obj = {
                    "workTables": workTables,
                    "name": dashboardName,
                    "layout": layoutStyle.class,
                    "backgroundColor": $("#mp_mainDiv").css("background-color"),
                    titleFontColor: titleFontColor,
                    themeId:echartsColorTheme,
                };
                // $rootScope.theme = 'ngdialog-theme-plain custom-width';
                if (obj.workTables.length == 0) {
                    //不需要保存
                    ngDialogTips(ngDialog,"无数据，不需要保存!");
                } else {

                    // ngDialog.openConfirm({
                    //     template: 'modalDialogId',
                    //     className: 'ngdialog-theme-default custom-theme'
                    // })
                    ngDialogInputTips(ngDialog, '保存', '仪表盘名称', '新建仪表盘', scope)
                        .then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                        if (value != null && value != "") {
                            obj.name = value;
                            dashboardO.value = obj.name;
                        }
                        savePie(obj, dashboardId);
                    }, function (reason) {
                        console.log('Modal promise rejected. Reason: ', reason);
                    });
                }
                function savePie(obj, id) {

                    //仪表盘信息
                    if (id == null || id == "") {
                        $http({
                            method: "POST",
                            url: ctx() + "/dashboards",
                            data: obj
                        }).success(function (freetrial) {
                            dashboardO.alt = freetrial.id;
                            ngDialogTips(ngDialog,"保存仪表盘成功!");
                            // ngDialogTips(ngDialog,"保存仪表盘成功！");
                        }).error(function (freetrial) {
                            ngDialogTips(ngDialog,"保存仪表盘失败!");
                        });
                    } else {
                        $http({
                            method: "PUT",
                            url: ctx() + "/dashboards/" + id,
                            data: obj
                        }).success(function (freetrial) {
                            ngDialogTips(ngDialog,"更新仪表盘成功!");
                        }).error(function (freetrial) {
                            ngDialogTips(ngDialog,"更新仪表盘失败！");
                        });
                    }
                }
            })


        }
    }
});