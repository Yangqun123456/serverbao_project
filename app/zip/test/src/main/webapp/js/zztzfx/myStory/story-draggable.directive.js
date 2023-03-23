//写jQuery拖拽指令
zztzApp.directive('storyDraggable', function ($http,$document, $compile,RenderPieService,storyDetail,locals,$state,pieDetail,ngDialog) {
    return {
       $scope: false,
        restrict: 'A',
        link: function ($scope, element, attr) {
        	var dropMenuList = [];
            var menunames = ['移除', '边框', '编辑'];
            var menutypes = ['remove', 'border', 'edit']
            for (var i = 0; i < menunames.length; i++) {
                var o = {};
                o.name = menunames[i];
                o.type = menutypes[i];
                dropMenuList.push(o);
            }
            $scope.dropMenuList = dropMenuList;
            //worktables右上角点击事件
            $scope.dropMenuClick = function (data) {
                // alert(JSON.stringify(data));

                if (data != null) {
                    if (data.type == 'remove') {
                        //移除worktables
                        $("#" + data.id).remove();
                        removeByValue($scope.dashboardIds, data.id.substring(10));
                        //设置拖拽区域
                    } else if (data.type == 'border') {
                        if ($("#" + data.id).hasClass("layout-border")) {
                            $("#" + data.id).removeClass("layout-border");
                        } else {
                            $("#" + data.id).addClass("layout-border");
                        }

                        //边框设置
                    } else if (data.type == 'edit') {
                        //编辑
                    	pieDetail.pieDetail = storyDetail.pieDetails;
                        RenderPieService.relocation2myPie(locals,$state);
                    }
                }
            }
//            console.log("come form on_angular_event:" + JSON.stringify(layoutStyle));
            //传送布局类型名称和class名称
            //格式{name:"layoutA",class:"layoutB",width:"",height:""}
            //未被拖拽过两次的度量*****************************************************************************************************************
            if (element.parents("div[class*='mp_leftModel']").length != 0) {
                element.on('mousedown', function (event) {
                	//获取当前拖拽的id
                    var dashboardsObj = element[0].getAttribute('alt');
                    var obj = eval('(' + dashboardsObj + ')');
                    if (!justingForTwice(obj)) {
	                    zIndex++;
	                    //记录元素在页面的初始位置
	                    iXD = this.clientLeft;
	                    iYD = this.clientTop;
	                    //记录元素在页面的终止位置
	                    var e = event || window.event;
	                    oXD = e.clientX - iXD;
	                    oYD = e.clientY - iYD;
	                    //复制一个被拖拽元素div
	                    var text = element.text();
	                    element.parents("ul").after($compile(
	                        "<div id='myPieDiv' class='mt_modelDiv'></div>"
	                    )($scope));
	                    element.parents("ul").next("div[id*='myPieDiv']").append($compile("<a class='fa fa-bar-chart' style='font-size:40px'></a>")($scope));
	                    element.parents("ul").next("div[id*='myPieDiv']").append($compile("<p>"+text+"</p>")($scope));
	                    debugger;
	                    element.parents("ul").next("div[id*='myPieDiv']").css({
	                    	"float":"none",
	                    	"background-color":"#ffffff",
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
                        ngDialogTips(ngDialog,obj.name+"已存在，请不要重复拖拽");
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
                            "left": (oXD-50) + "px",
                            "top": (oYD-80) + "px",
                            "z-index": zIndex,
                            "position": "absolute",
                            "cursor": "move"
                        });
                        $scope.layoutFlag=true;
                }
                //元素拖拽结束方法
                function mouseup(event) {
                    if (oXD >= 203) {
                    	debugger;
                        //开始生成图表
                        var dashboard =eval('(' + element.attr("alt") + ')');
                        
                        $scope.dashboardIds.push(dashboard.id);
                        
                    	$http({
                              method: "GET",
                              url: ctx()+"/dashboards/"+dashboard.id,
                              params:{}
                            }).success(function (data) {
                          debugger;
                          storyDetail.pieDetails = data;
                          $scope.layoutFlag=true;
                          angular.element("#mp_storyDiv").append($compile("<div class='layoutB layout-border' style='width:98%;height:auto;clear: both;background-color:"+data.backgroundColor+"'  id='mp_mainDiv" + data.id + "' ng-style='{\"border-color\": selectedLineForeColor}' ></div>")($scope));
                          angular.element("#mp_mainDiv" + data.id).append($compile("<p style='margin: 5px 5px;float:left;font-size:15px;font-weight: bold;' ng-style='{\"color\": titleFontColor,\"font-weight\":titleFontWeight,\"font-size\":titleFontSize,\"display\":titleShow}'>"+data.name+"</p>")($scope));
                          angular.element("#mp_mainDiv" + data.id).append($compile("<div class='innerDivChartDataMenu'><div class='right_menu'><i class='fa fa-bars right_menu_i_color' aria-hidden='true' menu-click=''></i></div><div class='dropdown-menu-bar display-control'><ul class='dropdown-menu'><li  ng-repeat='a in dropMenuList'><a ng-click='dropMenuClick({type:a.type,id:\"mp_mainDiv" + data.id + "\"})'>{{a.name}}</a></li></ul></div></div><div id='echartsDiv" + data.id + i + "' class = 'innerDivChartData' ></div>")($scope));
                          angular.element("#mp_mainDiv" + data.id).append($compile("<div style='clear: both;'></div>")($scope));
                            for(var z1=0;z1<data.workTableResults.length;z1++){
                        	  var workDetail = data.workTableResults[z1];
                      	      //通过workId获取图表
                              var echartsData = workDetail.result;
                              var echartsDataType = workDetail.dataType;
                          	  var layoutStyle = {};
                              layoutStyle.class = data.layout;
                             //渲染拖拽的仪表盘
                              	if (echartsData==null||echartsData.success == true) {
                              		XsColor = workDetail.xsColor//x轴颜色
                                    XwColor = workDetail.xwColor;//x文字颜色
                                    YsColor = workDetail.ysColor;//y轴颜色
                                    YwColor = workDetail.ywColor;//y文字颜色
                                    echartsColorTheme=data.themeId;//theme主题
                                    $("#mp_mainDiv"+ data.id).append($compile("<div  class = '" + layoutStyle.class + "' id='" + data.id+ workDetail.workTableId +z1 + "'></div>")($scope));
                                    $("#mp_mainDiv"+data.id+"  #"+data.id+ workDetail.workTableId +z1).append($compile("<div class='layout-overflow " + workDetail.tableBorderShow + "' ng-style='{\"border-color\": "+workDetail.tableBorderColor+"}' ></div>")($scope));
                                    $("#mp_mainDiv"+data.id+"  #"+data.id+ workDetail.workTableId +z1).children("div").last().css("border-color",workDetail.tableBorderColor);
                                    $("#mp_mainDiv"+data.id+"  #"+data.id+ workDetail.workTableId +z1).children("div").last().append($compile("<div class='innerDivChartDataMenu'><div class='worktables-title'><span style='color: "+data.titleFontColor+"'>" + workDetail.workTableName + "</span></div></div>")($scope));
                                    $("#mp_mainDiv"+data.id+"  #"+data.id+ workDetail.workTableId +z1).children("div").last().append($compile("<div id='echartsDiv" + data.id+ workDetail.workTableId +z1 + "' class = 'innerDivChartData' style='overflow-x: auto;'></div>")($scope));
                                    var parentId = 'echartsDiv' + data.id+ workDetail.workTableId +z1;
	                                RenderPieService.judgingChartType(parentId, echartsData, $compile, $scope, echartsDataType,data.workTableResults[z1].measures,data.workTableResults[z1].dimTable,data.workTableResults[z1].filters,data.workTableResults[z1].cubeId,$http);
	                              }
	                              else {
	                            	  ngDialogTips(ngDialog,"无数据！");
	                              }
                            }

                          }).error(function (data) {
                        	  ngDialogTips(ngDialog,"获取数据失败!");
                	          console.log("获取数据失败");
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
            }
            ////未被拖拽过两次的度量结束*****************************************************************************************************************
        }
    };
});

//判断拖拽次数
function justingForTwice(data) {
	debugger;
    if ($("#mp_mainDiv" + data.id).length > 0) {
        return true;
    } else {
        return false;
    }
}

function removeByValue(arr, val) {
	  for(var i=0; i<arr.length; i++) {
	    if(arr[i] == val) {
	      arr.splice(i, 1);
	      break;
	    }
	  }
	}