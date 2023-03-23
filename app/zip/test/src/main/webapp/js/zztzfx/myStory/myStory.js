/**
 * xc
 */
var ctx = function() {
	  var path = window.location.href;
	  var pathName = window.location.pathname;
	  var hostPath = path.substring(0, path.indexOf(pathName))
	  var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
	  return (hostPath + projectName);
}

zztzApp.controller('myStory', function ($scope, $http,$state,$compile,storyDetail,locals,RenderPieService,pieDetail,ngDialog) {
	
	$scope.dashboardIds = [];
	$http({
        method: "POST",
        url: ctx() + "/theme/getThemeList",
        params:{}
    }).success(function (freetrial) {
    	console.log("getThemeList:"+JSON.stringify(freetrial));
    	if(freetrial!=null){
    		$scope.themeList=freetrial.data;
    	}
    }).error(function (freetrial) {
    	console.log("查询数据异常！");
    });
	
	if(storyDetail.storyDetail!=null && storyDetail.storyDetail.themeId!=null){
		$http({
			method: "POST",
			url: ctx() + "/theme/getThemeList",
			params:{"themeId":storyDetail.storyDetail.themeId}
		}).success(function (freetrial) {
			console.log("getThemeList:"+JSON.stringify(freetrial));
			if(freetrial!=null){
				$scope.theme=freetrial.data;
			}
		}).error(function (freetrial) {
			console.log("查询数据异常！");
		});
	}
	
	
	
	$scope.queryDashboard=function () {
	      $http({
	          method: "GET",
	          url: ctx()+"/dashboards/getDashboards"
	        }).success(function (data) {
            $scope.dashboardList=data;
            console.log("获取数据成功"+JSON.stringify(data));
	      }).error(function (data) {
	    	  ngDialogTips(ngDialog,"获取数据失败!");
	          console.log("获取数据失败");
	      });
  };
  
  $scope.relocation = function (){
  	var obj={
				"currentName":"menu_muyPie"
		}
		locals.setObject("href",obj);
  	angular.element("#menu_zztz").find("#menu_muyPie").addClass("active");
	angular.element("#menu_zztz").find("#menu_muyPie").siblings("li").removeClass("active");
  	$state.go("zztzfx.myPie");
  }
  
  $scope.newStory=function () {
		window.location.reload();
	};
	
	//设置
    $scope.bgSettings = function () {
        if ($("#bgSettingSelected").hasClass("display-control")) {
            $("#bgSettingSelected").removeClass("display-control");
        } else {
            $("#bgSettingSelected").addClass("display-control");
        }
    }
    
    $scope.themeColorSettings = function () {
    	if ($("#themeColorId").hasClass("display-control")) {
			$("#themeColorId").removeClass("display-control");
	    } else{
	        $("#themeColorId").addClass("display-control");
	    }
    };
    
    $scope.themeColorPicked = function (theme) {
    	echartsColorTheme = theme.themeId;
        $("#themeColorId").addClass("display-control");
        var dashboards = [];
        $.each($scope.dashboardIds, function(i, value) {
        	var dashboard = {};
        	dashboard.id = value;
        	dashboards.push(dashboard);
        });
        $http({
            method: "POST",
            url: ctx() + "/dashboards/getDashboards",
            data:JSON.stringify(dashboards)
//            params: {"dashboards":JSON.stringify(dashboards)}
        }).success(function (data) {
        	debugger;
        	$.each(data, function(j, value) {
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
                        	var pies = storyDetail.pieDetails;
                            for (var index in pies) {
                                if (pies[index].id == data.id.substring(10)) {
                                	pieDetail.pieDetail = pies[index];
                                }
                            }
                            RenderPieService.relocation2myPie(locals,$state);
                        }
                    }
                }
                debugger;
                  $("#mp_storyDiv").css("background-color",theme.storyBackground);
                  if(!$("#mp_mainDiv" + value.id).hasClass("layout-border")){
                	  $("#mp_mainDiv" + value.id).addClass("layout-border");
                  }
                  $("#mp_mainDiv" + value.id).css("background-color",theme.dashboardBackground);
                  $("#mp_mainDiv" + value.id).css("border-color",theme.storyBorder);
                  $("#mp_mainDiv" + value.id).children("p").first().css("color",theme.storyTitle);
                  $scope.titleFontColor = theme.storyTitle;
                  $scope.selectedLineForeColor = theme.storyBorder;
                    for(var z1=0;z1<value.workTableResults.length;z1++){
                       var workDetail = value.workTableResults[z1];
               	      //通过workId获取图表
                       var echartsData = workDetail.result;
                       var echartsDataType = workDetail.dataType;
                      //渲染拖拽的仪表盘
                       	if (echartsData.success == true) {
                       		XsColor = "";//x轴颜色
                            XwColor = "";//x文字颜色
                            YsColor = "";//y轴颜色
                            YwColor = "";//y文字颜色
                       		if(!$("#"+value.id+ workDetail.workTableId +z1).children("div").last().hasClass("layout-border")){
                       			$("#"+value.id+ workDetail.workTableId +z1).children("div").last().addClass("layout-border");
                       		}
                       		$("#"+value.id+ workDetail.workTableId +z1).children("div").last().css("border-color",theme.dashboardBorder);
                       		$("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().children("div").last().children("div").last().children("span").last().css("color",theme.dashboardTitle);
                         	var parentId = 'echartsDiv' + value.id+ workDetail.workTableId +z1;
                         	$("#"+parentId).empty();
                            RenderPieService.judgingChartType(parentId, echartsData, $compile, $scope, echartsDataType,value.workTableResults[z1].measures,value.workTableResults[z1].dimTable,value.workTableResults[z1].filters,value.workTableResults[z1].cubeId,$http);
                          }
                          else {
                        	  ngDialogTips(ngDialog,"无数据！");
                          }
                    }

        	});
        	
        }).error(function (data) {
        	ngDialogTips(ngDialog,"获取数据失败!");
            console.log("获取数据失败");
        });
    }

    //默认颜色
    var defaultColor = "#f2f2f2";
    $scope.defaultColor = defaultColor;
    $scope.selectedForeColor = dynamicSetColor(defaultColor);
    $scope.selectedLineForeColor = dynamicSetColor("red");
    $scope.titleFontColor = dynamicSetColor("#333");
    // 动态设置默认颜色
    $scope.dynamicSetColor = dynamicSetColor;
    var bgOrBorderColor = "";
    $scope.bgColorPicked = function () {
        bgOrBorderColor = "bgColor";
    }
    $scope.bgBorderColorPicked = function () {
        bgOrBorderColor = "borderColor";
    }
    $scope.bgTitleColorPicked = function () {
    	bgOrBorderColor = "titleColor";
    }
    function dynamicSetColor(color) {
        return color;
    }

    // 选择事件
    $scope.$on('colorPicked', function (event, color) {
    	debugger;
        if (bgOrBorderColor == 'bgColor') {
            $scope.selectedForeColor = color;
        } else if (bgOrBorderColor == 'borderColor') {
            $scope.selectedLineForeColor = color;
        } else if (bgOrBorderColor == 'titleColor') {
	    	$scope.titleFontColor = color;
	    }
        $("#bgSettingSelected").addClass("display-control");
    })
	
	$scope.getStory=function () {
		if (storyDetail.storyDetail != null) {
            console.log("storyDetail:" + JSON.stringify(storyDetail.storyDetail));
            var myPie_main = document.getElementById("myPie_main");
            var mp_mainBar_nodes = myPie_main.childNodes;
            for (var d = 0; d < mp_mainBar_nodes.length; d++) {
                if (mp_mainBar_nodes[d].nodeName == "DIV") {
                    var mp_tabButton_nodes = mp_mainBar_nodes[d].childNodes;
                    for (var j = 0; j < mp_tabButton_nodes.length; j++) {
                        if (mp_tabButton_nodes[j].nodeName == "DIV") {
                            var mp_tabButton = mp_tabButton_nodes[j].childNodes;
                            for (var k = 0; k < mp_tabButton.length; k++) {
                                if (mp_tabButton[k].nodeName == "INPUT") {
                                    mp_tabButton[k].setAttribute("value", storyDetail.storyDetail.name);
                                    mp_tabButton[k].setAttribute("alt", storyDetail.storyDetail.id);
                                }
                            }
                        }
                    }
                }
            }
            $http({
                method: "GET",
                url: ctx() + "/stories/" + storyDetail.storyDetail.id,
                params: {}
            }).success(function (data) {
            	storyDetail.pieDetails = data.dashboardVo;
            	$scope.selectedForeColor = dynamicSetColor(data.backgroundColor);
            	$scope.titleFontSize = data.titleFontSize;
            	$scope.titleFontWeight = data.titleFontWeight;
            	$scope.titleFontColor = data.titleFontColor;
            	$scope.titleShow = data.titleShow;
            	$.each(data.dashboardVo, function(j, value) {
            		$scope.dashboardIds.push(value.id);
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
                            	var pies = storyDetail.pieDetails;
                                for (var index in pies) {
                                    if (pies[index].id == data.id.substring(10)) {
                                    	pieDetail.pieDetail = pies[index];
                                    }
                                }
                                RenderPieService.relocation2myPie(locals,$state);
                            }
                        }
                    }
                    debugger;
                      $scope.selectedLineForeColor = value.borderColor;
                      $scope.layoutFlag=true;
                      if($scope.theme!=null){
                    	  value.backgroundColor = $scope.theme[0].dashboardBackground;
                    	  value.titleFontColor = $scope.theme[0].dashboardTitle;
                      }
                      angular.element("#mp_storyDiv").append($compile("<div class='layoutB "+value.borderShow+"' style='width:98%;height:auto;clear: both;background-color:"+value.backgroundColor+"'  id='mp_mainDiv" + value.id + "' ng-style='{\"border-color\": selectedLineForeColor}' ></div>")($scope));
                      angular.element("#mp_mainDiv" + value.id).append($compile("<p style='margin: 5px 5px;float:left;font-size:15px;font-weight: bold;' ng-style='{\"color\": titleFontColor,\"font-weight\":titleFontWeight,\"font-size\":titleFontSize,\"display\":titleShow}'>"+value.name+"</p>")($scope));
                      angular.element("#mp_mainDiv" + value.id).append($compile("<div class='innerDivChartDataMenu'><div class='right_menu'><i class='fa fa-bars right_menu_i_color' aria-hidden='true' menu-click=''></i></div><div class='dropdown-menu-bar display-control'><ul class='dropdown-menu'><li  ng-repeat='a in dropMenuList'><a ng-click='dropMenuClick({type:a.type,id:\"mp_mainDiv" + value.id + "\"})'>{{a.name}}</a></li></ul></div></div><div id='echartsDiv" + value.id + i + "' class = 'innerDivChartData' ></div>")($scope));
                      angular.element("#mp_mainDiv" + value.id).append($compile("<div style='clear: both;'></div>")($scope));
                        for(var z1=0;z1<value.workTableResults.length;z1++){
	                       var workDetail = value.workTableResults[z1];
                   	      //通过workId获取图表
                           var echartsData = workDetail.result;
                           var echartsDataType = workDetail.dataType;
                       	  var layoutStyle = {};
                           layoutStyle.class = value.layout;
                          //渲染拖拽的仪表盘
                           	if (echartsData==null||echartsData.success == true) {
                           	XsColor = workDetail.xsColor//x轴颜色
                             XwColor = workDetail.xwColor;//x文字颜色
                             YsColor = workDetail.ysColor;//y轴颜色
                             YwColor = workDetail.ywColor;//y文字颜色
                             if($scope.theme!=null){
                            	workDetail.tableBorderShow = "layout-border";
                           	  	workDetail.tableBorderColor = $scope.theme[0].dashboardBorder;
                             }
                             $("#mp_mainDiv"+ value.id).append($compile("<div  class = '" + layoutStyle.class + "' id='" + value.id+ workDetail.workTableId +z1 + "'></div>")($scope));
                             $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).append($compile("<div class='layout-overflow " + workDetail.tableBorderShow + "' ng-style='{\"border-color\": "+workDetail.tableBorderColor+"}' ></div>")($scope));
                             $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().css("border-color",workDetail.tableBorderColor);
                             $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().append($compile("<div class='innerDivChartDataMenu'><div class='worktables-title'><span style='color: "+value.titleFontColor+"'>" + workDetail.workTableName + "</span></div></div>")($scope));
                             $("#mp_mainDiv"+value.id+"  #"+value.id+ workDetail.workTableId +z1).children("div").last().append($compile("<div id='echartsDiv" + value.id+ workDetail.workTableId +z1 + "' class = 'innerDivChartData' style='overflow-x: auto;'></div>")($scope));
                             var parentId = 'echartsDiv' + value.id+ workDetail.workTableId +z1;
                             debugger;
                                RenderPieService.judgingChartType(parentId, echartsData, $compile, $scope, echartsDataType,value.workTableResults[z1].measures,value.workTableResults[z1].dimTable,value.workTableResults[z1].filters,value.workTableResults[z1].cubeId,$http);
                              }
                              else {
                            	  ngDialogTips(ngDialog,"无数据！");
                              }
                        }

            	});
            }).error(function (data) {
            	ngDialogTips(ngDialog,"获取数据失败!");
                console.log("获取数据失败");
            });
            
		}
	};
	
	function default_layout(defaultStyle) {
		var layObj=[];
	    layObj['layoutA']="line_color_unselected";
	    layObj['layoutB']="line_color_unselected";
	    layObj[defaultStyle]="line_color_selected";
	    $scope.layObj=layObj;
	    currentLayout=defaultStyle;

	}
	
    $scope.default_layout=default_layout("layoutB");
    
});

function removeByValue(arr, val) {
	  for(var i=0; i<arr.length; i++) {
	    if(arr[i] == val) {
	      arr.splice(i, 1);
	      break;
	    }
	  }
	}
